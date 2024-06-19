const sequelize = require("../config/dbConn").sequelize;
const Occurrences = require("../models/Occurrences");
// const User = require("../models/User");
const { executeAndStoreQueryResult } = require('../services/broadcastService');

const { sendEmail } = require("./emailController");

// Create a new occurrence
exports.createOccurrence = async (req, res) => {
  try {

    // Get the current year and month
    const currentYear = new Date().getFullYear().toString().slice(-2); // Extract last two digits of the year
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0"); // Get current month and ensure it's zero-padded
    const fullYear = new Date().getFullYear().toString();

    // Find the last job detail entry for the current month
    const lastReport = await Occurrences.findOne({
      attributes: [
        [
          sequelize.literal(
            'MAX(CAST(SUBSTRING("reportid", 1, 3) AS integer))'
          ),
          "lastReportId",
        ],
        "createAt", // Add createAt to the attributes
      ],
      where: sequelize.literal(
        `YEAR("createAt") = '${fullYear}' AND MONTH("createAt") = '${currentMonth}'`
      ),
      group: ["createAt"],
      order: [[sequelize.literal("createAt"), "DESC"]], // Order by createAt column
    });

    let lastReportId = "001"; // Default reportid if no previous entry found for the month
    const lastID = lastReport?.dataValues.lastReportId || "";

    if (lastReport && lastID != "") {
      // Increment lastReportId by 1
      lastReportId = (parseInt(lastID) + 1).toString().padStart(3, "0");
    }

    // Concatenate year and month to form the reportid
    const reportId = lastReportId + currentMonth + currentYear;

    const occurrenceDate = new Date(req.body.occurrencedate);
    const formattedOccurrenceDate = occurrenceDate.toISOString().replace('T', ' ').replace('Z', '');

    const result = await Occurrences.create({
      ...req.body,
      occurrencedate: sequelize.literal(`'${formattedOccurrenceDate}'`),
      formstatus: "1",
      createAt: sequelize.literal("CURRENT_TIMESTAMP"),
      reportid: reportId, // Assign the generated reportId
    });

    // Get the ID of the newly created occurrence
    const newOccurrenceId = result.id;

    // Email
    const emailSubject = "รายงานอุบัติการณ์ เลขที่เอกสาร: " + reportId;
    const emailMessage = "เลขที่เอกสาร: " + reportId + `<br/><br/>` + "สร้างรายงานสำเร็จ รอตรวจสอบ";
    const haEmail = "qdc@thainakarin.co.th";

    sendEmail(haEmail, newOccurrenceId, emailSubject, emailMessage);
    executeAndStoreQueryResult();
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all occurrences
exports.getAllOccurrences = async (req, res) => {
  try {
    // First query to get occurrences and user details
    const occQuery = `
      SELECT occ.*,
        CONCAT(u_request.title, ' ', u_request.name, ' ', u_request.lastname) AS requestby,
        u_request.dep AS requestdep,
        u_request.faction AS requestfac,
        u_request.affiliation AS requestaff,
        CASE
          WHEN u_update.userid IS NULL THEN NULL
          ELSE CONCAT(u_update.title, ' ', u_update.name, ' ', u_update.lastname)
        END AS updateby,
        u_update.dep AS updatedep,
        u_update.faction AS updatefac,
        u_update.affiliation AS updateaff,
        CASE 
          WHEN u_accept.userid IS NULL THEN NULL
          ELSE CONCAT(u_accept.title, ' ', u_accept.name, ' ', u_accept.lastname)
        END AS acceptby,
        u_accept.dep AS acceptdep,
        u_accept.faction AS acceptfac,
        u_accept.affiliation AS acceptaff,
        CASE WHEN occ.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename
      FROM [occurrence].[dbo].[occurrences] occ
      LEFT JOIN [occurrence].[dbo].[user] AS u_request ON u_request.userid = occ.createby
      LEFT JOIN [occurrence].[dbo].[user] AS u_update ON u_update.userid = occ.updateby
      LEFT JOIN [occurrence].[dbo].[user] AS u_accept ON u_accept.userid = occ.acceptby
      ORDER BY CASE WHEN occ.formstatus = '1' THEN 0 ELSE 1 END;
    `;

    const results = await sequelize.query(occQuery, {
      type: sequelize.QueryTypes.SELECT
    });

    if (results.length > 0) {
      // Fetch department and affiliation data using raw query
      const deptAffData = await sequelize.query(
        `SELECT d.id, d.name AS DepName, a.id AS AffID, a.name AS AffName
         FROM [occurrence].[dbo].[department] d
         LEFT JOIN [occurrence].[dbo].[affiliation] a ON a.id = d.relateid`,
        { type: sequelize.QueryTypes.SELECT }
      );

      // Use map to parse JSON fields before sending the response
      const parsedResults = results.map(occurrence => {
        let deptRelateIds = [];

        try {
          // Parse deptrelate field assuming it's a JSON array of strings
          deptRelateIds = JSON.parse(occurrence.deptrelate || '[]').map(id => parseInt(id, 10));
        } catch (e) {
          // Handle parsing error if any
          console.error("Error parsing deptrelate:", e);
        }

        // Map deptRelateIds to department and affiliation data
        const deptAffInfo = deptRelateIds.map(id => {
          return deptAffData.find(dept => dept.id === id) || {};
        });

        return {
          ...occurrence,
          deptrelate: JSON.parse(occurrence.deptrelate || '[]'),
          patientcare: JSON.parse(occurrence.patientcare || '[]'),
          patientsupport: JSON.parse(occurrence.patientsupport || '[]'),
          utility: JSON.parse(occurrence.utility || '[]'),
          equipment: JSON.parse(occurrence.equipment || '[]'),
          safety: JSON.parse(occurrence.safety || '[]'),
          service: JSON.parse(occurrence.service || '[]'),
          management: JSON.parse(occurrence.management || '[]'),
          deptAffInfo
        };
      });

      return res.status(200).json(parsedResults);
    } else {
      return res.status(404).json({ error: "Occurrence not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single occurrence by ID
exports.getOccurrenceById = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "id is required." });
  }

  const reportid = req?.params?.id;

  try {
    // First query to get occurrences and user details
    const occQuery = `
      SELECT occ.*,
        CONCAT(u_request.title, ' ', u_request.name, ' ', u_request.lastname) AS requestby,
        u_request.dep AS requestdep,
        u_request.faction AS requestfac,
        u_request.affiliation AS requestaff,
        CASE
          WHEN u_update.userid IS NULL THEN NULL
          ELSE CONCAT(u_update.title, ' ', u_update.name, ' ', u_update.lastname)
        END AS updateby,
        u_update.dep AS updatedep,
        u_update.faction AS updatefac,
        u_update.affiliation AS updateaff,
        CASE 
          WHEN u_accept.userid IS NULL THEN NULL
          ELSE CONCAT(u_accept.title, ' ', u_accept.name, ' ', u_accept.lastname)
        END AS acceptby,
        u_accept.dep AS acceptdep,
        u_accept.faction AS acceptfac,
        u_accept.affiliation AS acceptaff,
        CASE WHEN occ.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename
      FROM [occurrence].[dbo].[occurrences] occ
      LEFT JOIN [occurrence].[dbo].[user] AS u_request ON u_request.userid = occ.createby
      LEFT JOIN [occurrence].[dbo].[user] AS u_update ON u_update.userid = occ.updateby
      LEFT JOIN [occurrence].[dbo].[user] AS u_accept ON u_accept.userid = occ.acceptby
      WHERE occ.id = :reportid;
    `;

    const results = await sequelize.query(occQuery, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { reportid }
    });

    if (results.length > 0) {
      // Fetch department and affiliation data using raw query
      const deptAffData = await sequelize.query(
        `SELECT d.id, d.name AS DepName, a.id AS AffID, a.name AS AffName
         FROM [occurrence].[dbo].[department] d
         LEFT JOIN [occurrence].[dbo].[affiliation] a ON a.id = d.relateid`,
        { type: sequelize.QueryTypes.SELECT }
      );

      // Use map to parse JSON fields before sending the response
      const parsedResults = results.map(occurrence => {
        let deptRelateIds = [];

        try {
          // Parse deptrelate field assuming it's a JSON array of strings
          deptRelateIds = JSON.parse(occurrence.deptrelate || '[]').map(id => parseInt(id, 10));
        } catch (e) {
          // Handle parsing error if any
          console.error("Error parsing deptrelate:", e);
        }

        // Map deptRelateIds to department and affiliation data
        const deptAffInfo = deptRelateIds.map(id => {
          return deptAffData.find(dept => dept.id === id) || {};
        });

        return {
          ...occurrence,
          deptrelate: JSON.parse(occurrence.deptrelate || '[]'),
          patientcare: JSON.parse(occurrence.patientcare || '[]'),
          patientsupport: JSON.parse(occurrence.patientsupport || '[]'),
          utility: JSON.parse(occurrence.utility || '[]'),
          equipment: JSON.parse(occurrence.equipment || '[]'),
          safety: JSON.parse(occurrence.safety || '[]'),
          service: JSON.parse(occurrence.service || '[]'),
          management: JSON.parse(occurrence.management || '[]'),
          deptAffInfo
        };
      });

      return res.status(200).json(parsedResults[0]);
    } else {
      return res.status(404).json({ error: "Occurrence not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an occurrence by ID
exports.updateOccurrence = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "id is required." });
  }

  const id = req?.body?.id;

  try {
    const occurrence = await Occurrences.findOne({ where: { id: id } });
    // const [updated] = await Occurrences.update(req.body, {
    //   where: { id: req.params.id },
    // });
    if (!occurrence) {
      return res.status(204).json({ message: `No Occurrences matches ID ${req.body.id}.` });
    }

    // Check if req.body.occurrencedate is provided and parse it
    if (req.body.occurrencedate) {
      const occurrencedate = new Date(req.body.occurrencedate);
      const formattedOccurrenceDate = occurrencedate.toISOString().replace('T', ' ').replace('Z', '');
      req.body.occurrencedate = sequelize.literal(`'${formattedOccurrenceDate}'`);
    }
    if (req.body.acceptdate) {
      const acceptdate = new Date(req.body.acceptdate);
      const formattedAcceptDate = acceptdate.toISOString().replace('T', ' ').replace('Z', '');
      req.body.acceptdate = sequelize.literal(`'${formattedAcceptDate}'`);
    }
    if (req.body.responsedate) {
      const responsedate = new Date(req.body.responsedate);
      const formattedResponseDate = responsedate.toISOString().replace('T', ' ').replace('Z', '');
      req.body.responsedate = sequelize.literal(`'${formattedResponseDate}'`);
    }

    if (req.body.updateby) {
      req.body.updateAt = sequelize.literal("CURRENT_TIMESTAMP");
    }

    const validColumns = req.body;
    // console.log("Data sets:", validColumns);

    // Loop through validColumns and update or remove values as needed
    for (const column in validColumns) {
      if (validColumns[column] === undefined || validColumns[column] === null || validColumns[column] === "Invalid date") {
        // Delete the property (column) from Occurrences
        delete occurrence[column];
        console.log("Removed column:", column);
      } else {
        // Update the property (column) in Occurrences
        occurrence[column] = validColumns[column];
        console.log("Updated column:", column);
        console.log("Updated value:", validColumns[column]);
      }
    }

    occurrence.updatedAt = sequelize.literal("CURRENT_TIMESTAMP");

    // Additional logging to trace the flow
    console.log("Before saving Occurrences:");
    console.log(occurrence.toJSON());

    const result = await occurrence.save();

    executeAndStoreQueryResult();

    // Additional logging after saving
    console.log("After saving Occurrences:");
    console.log(result.toJSON());

    // const updatedOccurrence = await Occurrences.findByPk(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// exports.updateOccurrences = async (req, res) => {
//   try {
//     const [updated] = await Occurrences.update(req.body, {
//       where: { id: req.params.id },
//     });
//     if (!updated) {
//       return res.status(404).json({ error: "Occurrence not found" });
//     }
//     const updatedOccurrence = await Occurrences.findByPk(req.params.id);
//     res.status(200).json(updatedOccurrence);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// Delete an occurrence by ID
exports.deleteOccurrence = async (req, res) => {
  const Id = req?.params?.id;
  if (!Id) return res.status(400).json({ message: "Occurence ID required" });

  try {
    const occ = await Occurrences.findOne({ where: { id: Id, deleteAt: null } });
    if (!occ) {
      return res.status(204).json({ message: `Occurence ID ${Id} not found` });
    }
    occ.deleteAt = sequelize.fn('GETDATE');
    occ.formstatus = "3";
    await occ.save();
    executeAndStoreQueryResult();
    res.status(201).json({ message: `Occurence ID ${Id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exports.deleteOccurrence = async (req, res) => {
//   try {
//     const deleted = await Occurrences.destroy({
//       where: { id: req.params.id },
//     });
//     if (!deleted) {
//       return res.status(404).json({ error: "Occurrence not found" });
//     }
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };