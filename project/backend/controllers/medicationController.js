const sequelize = require("../config/dbConn").sequelize;
const Medication = require('../models/Medication');
// const User = require("../models/User");
const { executeAndStoreQueryResult } = require('../services/broadcastService');

// Create a new medication record
exports.createMedication = async (req, res) => {
  try {

    // Get the current year and month
    const currentYear = new Date().getFullYear().toString().slice(-2); // Extract last two digits of the year
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0"); // Get current month and ensure it's zero-padded
    const fullYear = new Date().getFullYear().toString();

    // Find the last job detail entry for the current month
    const lastReport = await Medication.findOne({
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

    const result = await Medication.create({
      ...req.body,
      occurrencedate: sequelize.literal(`'${formattedOccurrenceDate}'`),
      formstatus: "1",
      createAt: sequelize.literal("CURRENT_TIMESTAMP"),
      reportid: reportId, // Assign the generated reportId
    });

    executeAndStoreQueryResult();
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all medication
exports.getAllMedications = async (req, res) => {
  try {
    // First query to get medication and user details
    const medQuery = `
      SELECT med.*,
        aff.id AS AffID,
        aff.name AS AffName,
        dep.id AS DepID,
        dep.name AS DepName,
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
          WHEN u_approve.userid IS NULL THEN NULL
          ELSE CONCAT(u_approve.title, ' ', u_approve.name, ' ', u_approve.lastname)
        END AS approveby,
        u_approve.dep AS approvedep,
        u_approve.faction AS approvefac,
        u_approve.affiliation AS approveaff,
        CASE WHEN med.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename
      FROM [occurrence].[dbo].[medication] med
      LEFT JOIN [occurrence].[dbo].[user] AS u_request ON u_request.userid = med.createby
      LEFT JOIN [occurrence].[dbo].[user] AS u_update ON u_update.userid = med.updateby
      LEFT JOIN [occurrence].[dbo].[user] AS u_approve ON u_approve.userid = med.approveby
      LEFT JOIN [occurrence].[dbo].[department] as dep ON dep.id = med.deptrelate
      LEFT JOIN [occurrence].[dbo].[affiliation] as aff ON aff.id = dep.relateid
      ORDER BY CASE WHEN med.formstatus = '1' THEN 0 ELSE 1 END;
    `;

    const results = await sequelize.query(medQuery, {
      type: sequelize.QueryTypes.SELECT
    });

    if (results.length > 0) {
      // Use map to parse JSON fields before sending the response
      const parsedResults = results.map(medication => {
        const {
          DepID,
          DepName,
          AffID,
          AffName,
          ...rest
        } = medication;

        return {
          ...rest,
          prescribing: JSON.parse(medication.prescribing || '[]'),
          dispensing: JSON.parse(medication.dispensing || '[]'),
          administration: JSON.parse(medication.administration || '[]'),
          effect: JSON.parse(medication.effect || '[]'),
          drugrelate: JSON.parse(medication.drugrelate || '[]'),
          rca: JSON.parse(medication.rca || '[]'),
          deptAffInfo: {
            AffID,
            AffName,
            DepID,
            DepName,
          },
        };
      });

      return res.status(200).json(parsedResults);
    } else {
      return res.status(404).json({ error: "Medication not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single medication record by ID
exports.getMedicationById = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "id is required." });
  }

  const reportid = req?.params?.id;

  try {
    // First query to get medication and user details
    const medQuery = `
      SELECT med.*,
        aff.id AS AffID,
        aff.name AS AffName,
        dep.id AS DepID,
        dep.name AS DepName,
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
          WHEN u_approve.userid IS NULL THEN NULL
          ELSE CONCAT(u_approve.title, ' ', u_approve.name, ' ', u_approve.lastname)
        END AS approveby,
        u_approve.dep AS approvedep,
        u_approve.faction AS approvefac,
        u_approve.affiliation AS approveaff,
        CASE WHEN med.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename
      FROM [occurrence].[dbo].[medication] med
      LEFT JOIN [occurrence].[dbo].[user] AS u_request ON u_request.userid = med.createby
      LEFT JOIN [occurrence].[dbo].[user] AS u_update ON u_update.userid = med.updateby
      LEFT JOIN [occurrence].[dbo].[user] AS u_approve ON u_approve.userid = med.approveby
      LEFT JOIN [occurrence].[dbo].[department] as dep ON dep.id = med.deptrelate
      LEFT JOIN [occurrence].[dbo].[affiliation] as aff ON aff.id = dep.relateid
      WHERE med.id = :reportid;
    `;

    const results = await sequelize.query(medQuery, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { reportid }
    });

    if (results.length > 0) {
      // Use map to parse JSON fields before sending the response
      const parsedResults = results.map(medication => {
        const {
          DepID,
          DepName,
          AffID,
          AffName,
          ...rest
        } = medication;

        return {
          ...rest,
          prescribing: JSON.parse(medication.prescribing || '[]'),
          dispensing: JSON.parse(medication.dispensing || '[]'),
          administration: JSON.parse(medication.administration || '[]'),
          effect: JSON.parse(medication.effect || '[]'),
          drugrelate: JSON.parse(medication.drugrelate || '[]'),
          rca: JSON.parse(medication.rca || '[]'),
          deptAffInfo: {
            AffID,
            AffName,
            DepID,
            DepName,
          },
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

exports.updateMedication = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "id is required." });
  }

  const id = req?.body?.id;

  try {
    const med = await Medication.findOne({ where: { id: id } });
    if (!med) {
      return res.status(204).json({ message: `No Medication matches ID ${req.body.id}.` });
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

    if (req.body.approveby) {
      req.body.formstatus = '4';
      req.body.approveAt = sequelize.literal("CURRENT_TIMESTAMP");
    }

    const validColumns = req.body;
    // console.log("Data sets:", validColumns);

    // Loop through validColumns and update or remove values as needed
    for (const column in validColumns) {
      if (validColumns[column] === undefined || validColumns[column] === null || validColumns[column] === "Invalid date") {
        // Delete the property (column) from Medication
        delete med[column];
        console.log("Removed column:", column);
      } else {
        // Update the property (column) in Medication
        med[column] = validColumns[column];
        console.log("Updated column:", column);
        console.log("Updated value:", validColumns[column]);
      }
    }

    med.updatedAt = sequelize.literal("CURRENT_TIMESTAMP");

    // Additional logging to trace the flow
    console.log("Before saving Medication:");
    console.log(med.toJSON());

    const result = await med.save();

    executeAndStoreQueryResult();

    // Additional logging after saving
    console.log("After saving Medication:");
    console.log(result.toJSON());

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Update a medication record by ID
// exports.updateMedication = async (req, res) => {
//   try {
//     const medication = await Medication.findByPk(req.params.id);
//     if (medication) {
//       await medication.update(req.body);
//       res.status(200).json(medication);
//     } else {
//       res.status(404).json({ message: 'Medication not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Delete a medication record by ID
exports.deleteMedication = async (req, res) => {
  const Id = req?.params?.id;
  if (!Id) return res.status(400).json({ message: "Medication ID required" });

  try {
    const med = await Medication.findOne({ where: { id: Id, deleteAt: null } });
    if (!med) {
      return res.status(204).json({ message: `Medication ID ${Id} not found` });
    }
    med.deleteAt = sequelize.fn('GETDATE');
    med.formstatus = "3";
    await med.save();
    executeAndStoreQueryResult();
    res.status(201).json({ message: `Medication ID ${Id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};