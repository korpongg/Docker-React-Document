const sequelize = require("../config/dbConn").sequelize;
const Occurrences = require("../models/Occurrences");
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
exports.createOccurrence = async (req, res) => {
  try {
    const fileData = req.files || [];

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
      formstatus: req.body.formstatus ? req.body.formstatus : "1",
      createAt: sequelize.literal("CURRENT_TIMESTAMP"),
      reportid: reportId, // Assign the generated reportId
    });
  
    if (fileData.length > 0) {
      const renamePromises = fileData.map((file) => {
        const fileExt = path.extname(file.originalname).toLowerCase();
        const newFilename = `OCC${reportId}${fileExt}`;
        const oldPath = file.path;
        const newPath = path.join(__dirname, process.env.DB_STORE2, newFilename);
        console.log("newPath1", newPath);
        
        return new Promise((resolve, reject) => {
          fs.rename(oldPath, newPath, async (err) => {
            if (err) {
              reject(err);
            } else {
              const newBuildPath = path.join(__dirname, process.env.DB_STORE2_BUILD, newFilename);
              fs.copyFile(newPath, newBuildPath, (copyErr) => {
                if (copyErr) reject(copyErr);
                else resolve(newFilename);
              });
            }
          });
        });
      });
      result.image = await Promise.all(renamePromises);
      await result.save();
    }

    // Send email
    // if (!req.body.formstatus) {
    //   // Get the ID of the newly created occurrence
    //   const newOccurrenceId = result.id;
    //   const emailSubject = "รายงานอุบัติการณ์ เลขที่เอกสาร: " + reportId;
    //   const emailMessage = "เลขที่เอกสาร: " + reportId + `<br/><br/>` + "สร้างรายงานสำเร็จ รอตรวจสอบ";
    //   const recipientEmail = HA_EMAIL;
    //   sendEmail(recipientEmail, newOccurrenceId, emailSubject, emailMessage);
    // }

    executeAndStoreQueryResult();
    res.status(201).json(result);
  } catch (error) {
    console.log(error)
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
      FROM ${DB_NAME}.[dbo].[occurrences] occ
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
    const fileData = req.files;
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
        // console.log("Removed column:", column);
      } else {
        // Update the property (column) in Occurrences
        occurrence[column] = validColumns[column];
        // console.log("Updated column:", column);
        // console.log("Updated value:", validColumns[column]);
      }
    }

    occurrence.updatedAt = sequelize.literal("CURRENT_TIMESTAMP");

    // Additional logging to trace the flow
    // console.log("Before saving Occurrences:");
    // console.log(occurrence.toJSON());

    const result = await occurrence.save();

    if (fileData && fileData.length > 0) {
      const imgExtensions = [".jpg", ".jpeg", ".png"];
      const docExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"];
      let hasImageFile = false;
      let hasDocFile = false;

      fileData.forEach((file) => {
        const fileExt = path.extname(file.originalname).toLowerCase();
        if (imgExtensions.includes(fileExt)) hasImageFile = true;
        if (docExtensions.includes(fileExt)) hasDocFile = true;
      });

      if (hasImageFile || hasDocFile) {
        // Delete existing files before saving new ones
        if (hasImageFile) {
          imgExtensions.forEach((ext) => {
            const existingFilePath = path.join(__dirname, process.env.DB_STORE2, `OCC${req.body.reportid}${ext}`);
            if (fs.existsSync(existingFilePath)) {
              fs.unlinkSync(existingFilePath);
            }
          });
        }

        if (hasDocFile) {
          docExtensions.forEach((ext) => {
            const existingFilePath = path.join(__dirname, process.env.DB_STORE2, `OCC${req.body.reportid}${ext}`);
            if (fs.existsSync(existingFilePath)) {
              fs.unlinkSync(existingFilePath);
            }
          });
        }

        // Process file renaming and saving
        const renamePromises = fileData.map((file) => {
          const fileExt = path.extname(file.originalname).toLowerCase();
          const newFilename = `OCC${req.body.reportid}${fileExt}`;
          const oldPath = file.path;
          const newPath = path.join(__dirname, process.env.DB_STORE2, newFilename);
          console.log("newPath2", newPath);

          return new Promise((resolve, reject) => {
            fs.rename(oldPath, newPath, async (err) => {
              if (err) reject(err);
              else {
                const newBuildPath = path.join(__dirname, process.env.DB_STORE2_BUILD, newFilename);
                fs.copyFile(newPath, newBuildPath, (copyErr) => {
                  if (copyErr) reject(copyErr);
                  else resolve(newFilename);
                });
              }
            });
          });
        });

        result.image = await Promise.all(renamePromises);
        await result.save();
      }
    }

    // Determine if email should be sent based on level and reporttype
    const isGeneralRisk = result.reporttype === '0';
    const levelCheck = isGeneralRisk ? parseInt(result.level, 10) > 3 : ["E", "F", "G", "H", "I"].includes(result.level);

    // Send email
    if (req.body.formstatus === '1') {
      // Get the ID of the newly created occurrence
      const reportId = result.reportid;
      const emailSubject = "รายงานอุบัติการณ์ เลขที่เอกสาร: " + reportId;
      const emailMessage = "เลขที่เอกสาร: " + reportId + `<br/><br/>` + "สร้างรายงานสำเร็จ รอตรวจสอบ";
      const recipientEmail = HA_EMAIL;
      sendEmail(recipientEmail, id, emailSubject, emailMessage);
    }

    if (occurrence.acceptby === null && req.body.renew) {
      occurrence.acceptby = '1';
      const resAccept = await occurrence.save();

      if (resAccept) {
        let depArr = resAccept.deptrelate;
        if (typeof depArr === 'string') {
          depArr = JSON.parse(depArr);
        }

        // Fetch relateid from the department table based on depArr values
        const departments = await Department.findAll({
          where: { id: depArr },
          attributes: ['relateid', 'name']
        });

        // Group departments by relateid
        const departmentGroups = {};
        departments.forEach((item) => {
          const { relateid, name } = item.dataValues;
          if (!departmentGroups[relateid]) {
            departmentGroups[relateid] = [];
          }
          departmentGroups[relateid].push(name);
        });

        // Map relateids to corresponding email recipients
        const emailCC = [];
        const departmentList = [];

        Object.keys(departmentGroups).forEach((relateid) => {
          const names = departmentGroups[relateid].join(', ');
          departmentList.push(`${names}`);
          if (levelCheck) {
            switch (parseInt(relateid)) {
              case 1:
                emailCC.push('paitoon.k@thainakarin.co.th');
                break;
              case 2:
                emailCC.push('watson.a@thainakarin.co.th');
                break;
              case 3:
                emailCC.push('surussavadee.s@thainakarin.co.th');
                break;
              case 5:
                emailCC.push('thipachart.p@thainakarin.co.th');
                break;
              case 6:
                emailCC.push('malee.b@thainakarin.co.th');
                break;
              default:
                break;
            }
          }
        });
        
        const reportId = resAccept.reportid;
        // Join department list with a line break or comma, as preferred
        const formatDepList = departmentList.join(', ');
        const renewDesc = resAccept.renew.replace(/\n/g, '<br/>');
        const impromptDesc = resAccept.impromptusolution.replace(/\n/g, '<br/>');

        const emailSubject = "รายงานอุบัติการณ์ เลขที่เอกสาร: " + reportId;
        const emailMessage = `<div style="font-size: 18px;">
          <p style="font-size: 20px;">เรียนผู้บริหารรับทราบ รายงานอุบัติการณ์ระดับความเสี่ยงสูง</p><br/>
          <strong>รายละเอียดอุบัติการณ์</strong><br/>
          1. วันที่เกิดเหตุ: ${formatDateTime_N7(resAccept.occurrencedate)}<br/><br/>
          2. ประเภท: ${resAccept.reporttype === '0' ? 'General Risk' : 'Clinical Risk'}<br/><br/>
          3. ระดับความรุนแรง: ${resAccept.level}<br/><br/>
          4. หน่วยงานที่เกี่ยวข้อง: ${formatDepList} <br/><br/>
          5. สรุปเหตุการณ์:<br/> ${renewDesc}<br/><br/>
          6. การแก้ไขปัญหาเฉพาะหน้า:<br/> ${impromptDesc ? impromptDesc : '-'}</div>
        `;
        // const recipientEmail = 'pattarapon.k@thainakarin.co.th';
        const recipientEmail = HA_EMAIL;
        sendExecEmail(recipientEmail, emailCC, id, emailSubject, emailMessage);
      }
    }

    executeAndStoreQueryResult();

    // Additional logging after saving
    // console.log("After saving Occurrences:");
    // console.log(result.toJSON());

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