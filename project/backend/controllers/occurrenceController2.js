const sequelize = require("../config/dbConn").sequelize;
const Occurrences = require("../models/Occurrences2");
const personcomplaint = require("../models/PersonComplaint");
const Department = require("../models/Department");
// const User = require("../models/User");
const { executeAndStoreQueryResult } = require('../services/broadcastService');
const { sendEmail, sendExecEmail } = require("./emailController");
const DB_NAME = process.env.DB_NAME;
const HA_EMAIL = process.env.HA_EMAIL;

const fs = require('fs');
const path = require('path');

// Utility function to format date to dd/mm/yyyy hh:mm:ss
// const formatDateTime_N7 = (date) => {
//   if (!date) return null;
//     const d = new Date(date);

//     const day = d.getUTCDate();
//     const month = d.getUTCMonth() + 1;
//     const year = d.getUTCFullYear();
//     const hours = d.getUTCHours();
//     const minutes = d.getUTCMinutes();
//     const seconds = d.getUTCSeconds();

//     // Pad single-digit day, month, hours, minutes, and seconds with leading zeros
//     const formattedDay = day < 10 ? `0${day}` : `${day}`;
//     const formattedMonth = month < 10 ? `0${month}` : `${month}`;
//     const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
//     const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    
//     return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
// }

const formatDateTime_N7 = (date) => {
  if (!date) return null;

  let d;
  
  // If it's a Sequelize literal object, extract the value
  if (typeof date === 'object' && date.val) {
    d = new Date(date.val.replace(/^'|'$/g, '')); // Remove quotes if present
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) return null; // Ensure it's a valid date

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// Create a new occurrence
// =========================
// Create a new occurrence
// =========================
exports.createOccurrence = async (req, res) => {
  try {
    const { array, createby, urgent, faction } = req.body;

    const data = JSON.parse(array);
    const results = [];

    // ปีปัจจุบัน
    const now = new Date();
    const fullYear = now.getFullYear();
    const shortYear = fullYear.toString().slice(-2);
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");

    // =====================================================
    // ดึงเลข ordinal ล่าสุดครั้งเดียว เช่น 0025/2026
    // =====================================================
    const [lastOrdinalResult] = await sequelize.query(
      `
      SELECT 
        ISNULL(
          MAX(
            CAST(
              LEFT(ordinal_number, CHARINDEX('/', ordinal_number) - 1) AS INT
            )
          ), 
        0) AS lastOrdinal
      FROM person_complaint
      WHERE YEAR(createAt) = :fullYear
        AND ordinal_number LIKE '%/%'
      `,
      {
        replacements: { fullYear },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    let runningOrdinal = parseInt(lastOrdinalResult.lastOrdinal || 0, 10);

    // =====================================================
    // ดึง reportid ล่าสุดครั้งเดียว เช่น 0250426
    // =====================================================
    const [lastReportResult] = await sequelize.query(
      `
      SELECT 
        ISNULL(
          MAX(
            CAST(LEFT(reportid, 3) AS INT)
          ),
        0) AS lastReport
      FROM person_complaint
      WHERE YEAR(createAt) = :fullYear
        AND MONTH(createAt) = :currentMonth
      `,
      {
        replacements: {
          fullYear,
          currentMonth: parseInt(currentMonth),
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    let runningReport = parseInt(lastReportResult.lastReport || 0, 10);

    // =====================================================
    // LOOP
    // =====================================================
    for (let i = 0; i < data.length; i++) {
      // -------------------------
      // reportid เช่น 0260426
      // -------------------------
      runningReport++;

      const reportId =
        runningReport.toString().padStart(3, "0") +
        currentMonth +
        shortYear;

      // -------------------------
      // ordinal เช่น 0026/2026
      // -------------------------
      runningOrdinal++;

      const ordinal_number =
        `${runningOrdinal.toString().padStart(4, "0")}/${fullYear}`;

      // -------------------------
      // INSERT
      // -------------------------
      const result = await personcomplaint.create({
        number: data[i].id,
        id_document: data[i].id_document,
        department: data[i].department,
        faction,
        createby,
        createAt: sequelize.literal("CURRENT_TIMESTAMP"),
        updateAt: sequelize.literal("CURRENT_TIMESTAMP"),
        reportid: reportId,
        date_document: data[i].date_document,
        program_document: data[i].program_document,
        urgent,
        reply: 0,
        ordinal_number,
      });

      results.push(result);
    }

    // Broadcast
    if (typeof executeAndStoreQueryResult === "function") {
      await executeAndStoreQueryResult();
    }

    return res.status(200).json({
      message: "บันทึกสำเร็จ",
      count: results.length,
      data: results,
    });

  } catch (error) {
    console.error("createOccurrence Error:", error);

    return res.status(500).json({
      error: error.message,
    });
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
      FROM ${DB_NAME}.[dbo].[occurrences] occ
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_request ON u_request.userid = occ.createby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_update ON u_update.userid = occ.updateby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_accept ON u_accept.userid = occ.acceptby
      ORDER BY 
        CASE 
          WHEN occ.formstatus = '1' THEN 1
          WHEN occ.formstatus = '2' THEN 2
          WHEN occ.formstatus = '4' THEN 3
          WHEN occ.formstatus = '0' THEN 4
          WHEN occ.formstatus = '5' THEN 5
          WHEN occ.formstatus = '3' THEN 6
          ELSE 6 
        END;
    `;

    const results = await sequelize.query(occQuery, {
      type: sequelize.QueryTypes.SELECT
    });

    if (results.length > 0) {
      // Fetch department and affiliation data using raw query
      const deptAffData = await sequelize.query(
        `SELECT d.id, d.name AS DepName, a.id AS AffID, a.name AS AffName
         FROM ${DB_NAME}.[dbo].[department] d
         LEFT JOIN ${DB_NAME}.[dbo].[affiliation] a ON a.id = d.relateid`,
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
          deptrelate2: JSON.parse(occurrence.deptrelate2 || '[]'),
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

exports.getOccurrenceViewFormById = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "id is required." });
  }

  const reportid = req?.params?.id;

  try {
    // First query to get occurrences and user details
    const occQuery = `
        SELECT
 reportid,
 person.id as id ,
 id_document ,
 department,
 faction,
 createby,
 createAt,

  date_document,
 program_document,
 urgent,

   status,
 reply,
 date_received,
 department_received,
 dep.name as dep_name_send, 
 dep2.name as dep_name_received
FROM [dbo].[person_complaint] as person
LEFT JOIN [dbo].[department] as dep ON person.department = dep.id
LEFT JOIN [dbo].[department] as dep2 ON person.department_received = dep2.id
      WHERE person.reportid = :reportid;
    `;

    const results = await sequelize.query(occQuery, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { reportid }
    });

   
      return res.status(200).json(results);
  
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
      FROM ${DB_NAME}.[dbo].[occurrences2] occ
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_request ON u_request.userid = occ.createby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_update ON u_update.userid = occ.updateby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_accept ON u_accept.userid = occ.acceptby
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
         FROM ${DB_NAME}.[dbo].[department] d
         LEFT JOIN ${DB_NAME}.[dbo].[affiliation] a ON a.id = d.relateid`,
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
          deptrelate2: JSON.parse(occurrence.deptrelate2 || '[]'),
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

exports.getComplainantById = async (req, res) => {
  console.log('wdwdwadwadawd')
  if (!req?.params?.id) {
    return res.status(400).json({ message: "id is required." });
  }//console.log(req?.params?.id)
console.log(req?.params)
  const reportid = req?.params?.id;

  try {
    // First query to get occurrences and user details
    const occQuery = `
      SELECT per.*
        FROM ${DB_NAME}.[dbo].[person_complaint] per
    
      WHERE per.reportid = :reportid;
    `;
//console.log(occQuery)
    const results = await sequelize.query(occQuery, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { reportid }
    });

return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update an occurrence by ID
exports.updateOccurrence = async (req, res) => {

  if (!req?.body?.id) {
    return res.status(400).json({ message: "id is required." });
  }



const {array,createby,appeal,time,urgent,faction,reportid
  ,id_document,department,program_document,date_document
} = req.body
console.log('อัพเดททท222222222')
console.log(req.body)
const data = JSON.parse(array);
try{
const result2 = await personcomplaint.update(
  {
    id_document: data[0].id_document,
    department: data[0].department,
    date_document:data[0].date_document,
    faction: faction,
    updateAt: sequelize.literal("CURRENT_TIMESTAMP"),
    program_document:data[0].program_document,
    urgent: urgent,
    reply: 0,
    
  },
  {
    where: {
      reportid: reportid,
    },
  }
);

 
  //console.log('3333')


    executeAndStoreQueryResult();

    // Additional logging after saving
    // //console.log("After saving Occurrences:");
    // //console.log(result.toJSON());

    // const updatedOccurrence = await Occurrences.findByPk(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// exports.updateOccurrences = async (req, res) => {A
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

  if (!Id) {
    return res.status(400).json({
      message: "Occurrence ID required",
    });
  }

  try {
    const occ = await personcomplaint.findOne({
      where: { id: Id },
    });

    if (!occ) {
      return res.status(404).json({
        message: `Occurrence ID ${Id} not found`,
      });
    }

    // ลบจริงจากฐานข้อมูล
    await occ.destroy();

    // อัปเดต broadcast
    if (typeof executeAndStoreQueryResult === "function") {
      await executeAndStoreQueryResult();
    }

    return res.status(200).json({
      message: `ลบข้อมูล ID ${Id} สำเร็จ`,
    });

  } catch (error) {
    console.error("deleteOccurrence Error:", error);

    return res.status(500).json({
      error: error.message,
    });
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