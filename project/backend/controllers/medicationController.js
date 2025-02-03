const sequelize = require("../config/dbConn").sequelize;
const Medication = require('../models/Medication');
const Department = require("../models/Department");
// const User = require("../models/User");
const { executeAndStoreQueryResult } = require('../services/broadcastService');
const DataDict_Medication = require("./dataDictMedication");
const DataDict_Med = require("./dataDictMedicationRCA");
const { findMedDepartmentEmail, sendEmailMed, sendEmailMedEvent, sendExecEmail, sendEmailMedEventHA } = require("./emailController");
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

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// Function to get title by code
function getTitleByCodeMed(code, medication, type) {
  const remarks = {
    "4.1.99": medication.prescribingremark,
    "4.2.99": medication.dispensingremark,
    "4.3.99": medication.administrationremark,
    "4.4.99": medication.transcribingremark,
  };
  if (remarks[code]) {
    if (type === 'title') {
      return `อื่นๆ : ${remarks[code]}`;
    } else {
      return `${code} : ${remarks[code]}`;
    }
  }
  
  for (const section of Object.values(DataDict_Medication)) {
    const option = section.options.find(option => option.code === code);
    if (option) {
      return type === 'title' ? option.title : option.code;
    }
  }
  return '';
}

function getTopicByKeyMed(key, lang) {
  return lang === 'th' 
    ? DataDict_Medication[key]?.topicTH || '' 
    : DataDict_Medication[key]?.topic || '';
}

function getTitleByCode(code, remark, dataDict) {
  for (const option of dataDict.options) {
    if (option.code === code) {
      return " - " + option.title;
    }
    if (option.suboption) {
      const subOption = option.suboption.find(sub => sub.code === code);
      if (subOption) {
        return "; " + subOption.title;
      }
    }
  }
  return ` - อื่นๆ : ${remark}`; // Default title if code not found
}

function mapRCAtoTitles(rcaCodes, remark, dataDict) {
  return rcaCodes.map(code => getTitleByCode(code, remark, dataDict)).join('\n');
}

async function fetchResults(query, replacements) {
  return await sequelize.query(query, {
    replacements,
    type: sequelize.QueryTypes.SELECT
  });
}

function parseMedicationResults(results) {
  return results.map(medication => {
    const { reportid, prescribing, dispensing, administration, transcribing, rca, ...rest } = medication;

    const parseField = field => JSON.parse(medication[field] || '[]');
    const prescribingM = parseField('prescribing');
    const dispensingM = parseField('dispensing');
    const administrationM = parseField('administration');
    const transcribingM = parseField('transcribing');

    const reportDetails = [];
    const errorTypes = [];
    const reportCode = [];

    if (prescribingM.length) {
      reportDetails.push(prescribingM.map(code => getTitleByCodeMed(code, medication, 'title')).join(", \n"));
      errorTypes.push(`- ${getTopicByKeyMed('prescribing')}`);
      reportCode.push(prescribingM.map(code => getTitleByCodeMed(code, medication, 'code')).join(", "));
    }
    if (dispensingM.length) {
      if (reportDetails.length) reportDetails.push(", \n");
      reportDetails.push(dispensingM.map(code => getTitleByCodeMed(code, medication, 'title')).join(", \n"));
      errorTypes.push(`- ${getTopicByKeyMed('dispensing')}`);
      if (reportCode.length) reportCode.push(", \n");
      reportCode.push(dispensingM.map(code => getTitleByCodeMed(code, medication, 'code')).join(", "));
    }
    if (administrationM.length) {
      if (reportDetails.length) reportDetails.push(", \n");
      reportDetails.push(administrationM.map(code => getTitleByCodeMed(code, medication, 'title')).join(", \n"));
      errorTypes.push(`- ${getTopicByKeyMed('administration')}`);
      if (reportCode.length) reportCode.push(", \n");
      reportCode.push(administrationM.map(code => getTitleByCodeMed(code, medication, 'code')).join(", "));
    }
    if (transcribingM.length) {
      if (reportDetails.length) reportDetails.push(", \n");
      reportDetails.push(transcribingM.map(code => getTitleByCodeMed(code, medication, 'title')).join(", \n"));
      errorTypes.push(`- ${getTopicByKeyMed('transcribing')}`);
      if (reportCode.length) reportCode.push(", \n");
      reportCode.push(transcribingM.map(code => getTitleByCodeMed(code, medication, 'code')).join(", "));
    }

    const mappedTitles = mapRCAtoTitles(parseField('rca'), medication.rcaremark, DataDict_Med);

    return {
      ...rest,
      reportid: "\t" + reportid,
      error: reportDetails.join(""),
      errortype: "\t" + errorTypes.join("\n"),
      reportcode: reportCode.join(""),
      // effect: parseField('effect'),
      // drugrelate: parseField('drugrelate'),
      rca: mappedTitles
    };
  });
}

// Get Report
exports.rePort = async (req, res) => {
  const { startdate, enddate } = req.params;

  const baseQuery = `
    DECLARE @StartDate DATE, @EndDate DATE;
    SET @StartDate = :startdate;
    SET @EndDate = :enddate;

    SELECT med.id,
      med.reportid,
      med.hn,
      med.an,
      med.age,
      med.occurrencedate,
      dep.name AS depname,
      CASE WHEN med.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename,
      med.level,
      med.prescribing,
      med.prescribingremark,
      med.dispensing,
      med.dispensingremark,
      med.administration,
      med.administrationremark,
      med.transcribing,
      med.transcribingremark,
      med.rca,
      med.renew,
      med.analysis,
      med.solution,
      -- CONCAT(u_request.title, ' ', u_request.name, ' ', u_request.lastname) AS requestby,
      u_request.dep AS requestdep,
      -- u_request.faction AS requestfac,
      u_request.affiliation AS requestaff,
      CASE WHEN med.type = 'ipd' THEN 'IPD' ELSE 'OPD' END AS medtype,
      CASE WHEN dep.name = u_request.dep THEN 'SR' ELSE 'NR' END AS selfreport,
      CASE WHEN DATEDIFF(hour, med.occurrencedate, med.createAt) < 24 THEN 1  ELSE 0 END AS timelyreport,
      -- CASE
      --  WHEN u_update.userid IS NULL THEN NULL
      --  ELSE CONCAT(u_update.title, ' ', u_update.name, ' ', u_update.lastname)
      -- END AS updateby,
      -- u_update.dep AS updatedep,
      -- u_update.faction AS updatefac,
      -- u_update.affiliation AS updateaff,
      -- CASE 
      --  WHEN u_approve.userid IS NULL THEN NULL
      --  ELSE CONCAT(u_approve.title, ' ', u_approve.name, ' ', u_approve.lastname)
      -- END AS approveby,
      -- u_approve.dep AS approvedep,
      -- u_approve.faction AS approvefac,
      -- u_approve.affiliation AS approveaff,
      med.renewAt,
      med.approveAt
    FROM ${DB_NAME}.[dbo].[medication] med
    LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_request ON u_request.userid = med.createby
    -- LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_update ON u_update.userid = med.updateby
    -- LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_approve ON u_approve.userid = med.approveby
    LEFT JOIN ${DB_NAME}.[dbo].[department] as dep ON dep.id = med.deptrelate
  `;

  const whereClause = startdate && enddate
    ? ` WHERE CAST(med.[occurrencedate] AS date) BETWEEN CAST(@StartDate AS date) AND CAST(@EndDate AS date)`
    : startdate ? ` WHERE CAST(med.[occurrencedate] AS date) = CAST(@StartDate AS date)` : '';

  const query = baseQuery + whereClause;

  try {
    const results = await fetchResults(query, { startdate, enddate });
    if (results.length) {
      const parsedResults = parseMedicationResults(results);
      res.status(200).json(parsedResults);
    } else {
      res.status(204).json({ error: "Medication not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new medication record
exports.createMedication = async (req, res) => {
  try {
    const pdfFile = req.files || "";

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
      formstatus: req.body.formstatus ? req.body.formstatus : "1",
      createAt: sequelize.literal("CURRENT_TIMESTAMP"),
      reportid: reportId, // Assign the generated reportId
    });
    
    if (pdfFile.length > 0) {
      const renamePromises = pdfFile.map((image, i) => {
        const fileExtension = path.extname(image.originalname);
        const newFilename = `MED${reportId}${fileExtension}`;
        const oldPath = image.path;
        const newPath = path.join(__dirname, process.env.DB_STORE2, newFilename);
        console.log("newPath1", newPath);
        
        return new Promise((resolve, reject) => {
          fs.rename(oldPath, newPath, async (err) => {
            if (err) {
              reject(err);
            } else {
              const newBuildPath = path.join(__dirname, process.env.DB_STORE2_BUILD, newFilename);
              fs.copyFile(newPath, newBuildPath, (copyErr) => {
                if (copyErr) {
                  reject(copyErr);
                } else {
                  resolve(newFilename);
                }
              });
            }
          });
        });
      });
      result.image = await Promise.all(renamePromises);
      await result.save();
    }

    executeAndStoreQueryResult();
    
    res.status(201).json(result);
  } catch (error) {
    console.log(error)
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
      FROM ${DB_NAME}.[dbo].[medication] med
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_request ON u_request.userid = med.createby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_update ON u_update.userid = med.updateby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_approve ON u_approve.userid = med.approveby
      LEFT JOIN ${DB_NAME}.[dbo].[department] as dep ON dep.id = med.deptrelate
      LEFT JOIN ${DB_NAME}.[dbo].[affiliation] as aff ON aff.id = dep.relateid
      ORDER BY 
        CASE 
          WHEN med.formstatus = '1' THEN 1
          WHEN med.formstatus = '4' THEN 2
          WHEN med.formstatus = '0' THEN 3
          WHEN med.formstatus = '2' THEN 4
          WHEN med.formstatus = '3' THEN 5
          ELSE 6 
        END;
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
          transcribing: JSON.parse(medication.transcribing || '[]'),
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
      FROM ${DB_NAME}.[dbo].[medication] med
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_request ON u_request.userid = med.createby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_update ON u_update.userid = med.updateby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_approve ON u_approve.userid = med.approveby
      LEFT JOIN ${DB_NAME}.[dbo].[department] as dep ON dep.id = med.deptrelate
      LEFT JOIN ${DB_NAME}.[dbo].[affiliation] as aff ON aff.id = dep.relateid
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
          transcribing: JSON.parse(medication.transcribing || '[]'),
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
exports.updateMedication = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "id is required." });
  }

  const id = req?.body?.id;

  try {
    const pdfFile = req.files || "";
    const med = await Medication.findOne({ where: { id: id } });
    if (!med) {
      return res.status(204).json({ message: `No Medication matches ID ${req.body.id}.` });
    }
    const prevStatus = med.formstatus;
    const prevRenew = med.renew;

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

      if (med.renew === null && req.body.renew) {
        req.body.formstatus = '4';
        req.body.renewby = req.body.updateby;
        req.body.renewAt = sequelize.literal("CURRENT_TIMESTAMP");
      }

      if ((med.renew !== null && req.body.renew) && med.renew !== req.body.renew) {
        req.body.formstatus = '4';
        req.body.renewby = req.body.updateby;
        req.body.renewAt = sequelize.literal("CURRENT_TIMESTAMP");
      }
    }

    if (req.body.approveby) {
      req.body.formstatus = '5';
      req.body.approveAt = sequelize.literal("CURRENT_TIMESTAMP");
    }

    const validColumns = req.body;
    // console.log("Data sets:", validColumns);

    // Loop through validColumns and update or remove values as needed
    for (const column in validColumns) {
      if (validColumns[column] === undefined || validColumns[column] === null || validColumns[column] === "Invalid date") {
        // Delete the property (column) from Medication
        delete med[column];
        // console.log("Removed column:", column);
      } else {
        // Update the property (column) in Medication
        med[column] = validColumns[column];
        // console.log("Updated column:", column);
        // console.log("Updated value:", validColumns[column]);
      }
    }

    // Additional logging to trace the flow
    // console.log("Before saving Medication:");
    // console.log(med.toJSON());

    const result = await med.save();
    
    if (pdfFile && pdfFile.length > 0) {
      const renamePromises = pdfFile.map((image, i) => {
        const fileExtension = path.extname(image.originalname);
        const newFilename = `MED${req.body.reportid}${fileExtension}`;
        const oldPath = image.path;
        const newPath = path.join(__dirname, process.env.DB_STORE2, newFilename);
        console.log("newPath2", newPath);
        
        return new Promise((resolve, reject) => {
          fs.rename(oldPath, newPath, async (err) => {
            if (err) reject(err);
            else {
              const newBuildPath = path.join(__dirname, process.env.DB_STORE2_BUILD, newFilename);
              fs.copyFile(newPath, newBuildPath, (copyErr) => {
                if (copyErr) {
                  reject(copyErr);
                } else {
                  resolve(newFilename);
                }
              });
            }
          });
        });
      });
      result.image = await Promise.all(renamePromises);
      await result.save();
    }

    executeAndStoreQueryResult();

    // Send Email to Exec and HA
    if (prevStatus === '0' && req.body.formstatus === '1') {
      const reportId = result.reportid;
      const emailSubject = "รายงานความคลาดเคลื่อนทางยา เลขที่เอกสาร: " + reportId;
      const emailMessage = "เลขที่เอกสาร: " + reportId + `<br/><br/>` + "สร้างรายงานสำเร็จ รอตรวจสอบ";
      const recipientEmail = HA_EMAIL;
      sendEmailMed(recipientEmail, id, emailSubject, emailMessage);
    }

    // Send Email HA to Dep and Exec
    if (prevRenew === null && req.body.renew) {
      const levelCheck = ["E", "F", "G", "H", "I"].includes(result.level);
      const reportId = result.reportid;
  
      // Map prescribing
      const prescribing = JSON.parse(med.prescribing || '[]');
      const prescribingDetails = prescribing.map(code => `(${code}) ` + getTitleByCodeMed(code, med, 'title')).join(", \n");
  
      // Map dispensing
      const dispensing = JSON.parse(med.dispensing || '[]');
      const dispensingDetails = dispensing.map(code => `(${code}) ` + getTitleByCodeMed(code, med, 'title')).join(", \n");
  
      // Map administration
      const administration = JSON.parse(med.administration || '[]');
      const administrationDetails = administration.map(code => `(${code}) ` + getTitleByCodeMed(code, med, 'title')).join(", \n");
  
      // Map transcribing
      const transcribing = JSON.parse(med.transcribing || '[]');
      const transcribingDetails = transcribing.map(code => `(${code}) ` + getTitleByCodeMed(code, med, 'title')).join(", \n");

      const emailSubject = "รายงานความคลาดเคลื่อนทางยา เลขที่เอกสาร: " + reportId;
      const emailMessage = `
        เลขที่เอกสาร: ${reportId}<br/><br/>
        มีรายงานความคลาดเคลื่อนทางยาถึงหน่วยงาน<br/><br/>
        <strong>รายละเอียดรายงานความคลาดเคลื่อนทางยา:</strong><br/>
        เกิดเมื่อ: ${formatDateTime_N7(result.occurrencedate)}<br/>
        ประเภท: ${result.reporttype === '0' ? 'General Risk' : 'Clinical Risk'}<br/>
        ระดับความรุนแรง: ${result.level ? result.level : `ไม่ระบุ`}<br/><br/>
        ${prescribingDetails ? `<u>${getTopicByKeyMed('prescribing', 'th')}:</u><br/> ${prescribingDetails}<br/><br/>` : ""}
        ${dispensingDetails ? `<u>${getTopicByKeyMed('dispensing', 'th')}:</u><br/> ${dispensingDetails}<br/><br/>` : ""}
        ${administrationDetails ? `<u>${getTopicByKeyMed('administration', 'th')}:</u><br/> ${administrationDetails}<br/><br/>` : ""}
        ${transcribingDetails ? `<u>${getTopicByKeyMed('transcribing', 'th')}:</u><br/> ${transcribingDetails}<br/><br/>` : ""}
        <br/><b>***รบกวนหน่วยงานตอบกลับภายใน 7 วัน***</b><br/>
      `;
      const recipientEmail = await findMedDepartmentEmail(reportId);
      // const recipientEmail = HA_EMAIL;
      sendEmailMedEvent(recipientEmail, id, emailSubject, emailMessage);

      // Send to Exec
      if (levelCheck) {
        const departments = await Department.findOne({
          where: { id: result.deptrelate },
          attributes: ['relateid', 'name']
        });
        
        const emailCC = [];
        switch (parseInt(departments.relateid)) {
          case 1:
            emailCC.push('paitoon.k@thainakarin.co.th');
            break;
          case 3:
            emailCC.push('surussavadee.s@thainakarin.co.th');
            break;
          case 5:
            emailCC.push('thipachart.p@thainakarin.co.th');
            break;
          default:
            break;
        }

        const renewDesc = result.renew.replace(/\n/g, '<br/>');
        const emailSubject = "รายงานความคลาดเคลื่อนทางยา เลขที่เอกสาร: " + reportId;
        const emailMessage = `<div style="font-size: 18px;">
          <p style="font-size: 20px;">เรียนผู้บริหารรับทราบ รายงานความคลาดเคลื่อนทางยาระดับสูง</p><br/>
          <strong>รายละเอียดความคลาดเคลื่อนทางยา</strong><br/>
          1. วันที่เกิดเหตุ: ${formatDateTime_N7(result.occurrencedate)}<br/><br/>
          2. ประเภท: ${result.reporttype === '0' ? 'General Risk' : 'Clinical Risk'}<br/><br/>
          3. ระดับความรุนแรง: ${result.level}<br/><br/>
          4. หน่วยงานที่เกี่ยวข้อง: ${departments.name} <br/><br/>
          5. สรุปเหตุการณ์:<br/> ${renewDesc}</div>
        `;
        const recipientEmail = 'pattarapon.k@thainakarin.co.th';
        // const recipientEmail = HA_EMAIL;
        sendExecEmail(recipientEmail, emailCC, id, emailSubject, emailMessage);
      }
    }

    // Send Email Dep to HA
    if (req.body.approveby) {
      const reportId = result.reportid;
      const emailSubject = `รายงานความคลาดเคลื่อนทางยา เลขที่เอกสาร: ${reportId}`;
      const emailMessage = `เลขที่เอกสาร: ${reportId}<br/><br/>หน่วยงานทำการบันทึกผลการทบทวนรายงานความคลาดเคลื่อนทางยาแล้ว`;
      const recipientEmail = HA_EMAIL;
      sendEmailMedEventHA(recipientEmail, id, emailSubject, emailMessage);
    }

    // Additional logging after saving
    console.log("After saving Medication:");
    console.log(result.toJSON());

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a medication record by ID
exports.deleteMedication = async (req, res) => {
  const Id = req?.params?.id;
  const UserID = req?.params?.userid;
  if (!Id && !UserID) return res.status(400).json({ message: "Medication ID report and UserID is required" });

  try {
    const med = await Medication.findOne({ where: { id: Id, deleteAt: null } });
    if (!med) {
      return res.status(204).json({ message: `Medication ID ${Id} not found` });
    }
    med.deleteby = UserID;
    med.deleteAt = sequelize.fn('GETDATE');
    med.formstatus = "3";
    await med.save();
    executeAndStoreQueryResult();
    res.status(201).json({ message: `Medication ID ${Id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};