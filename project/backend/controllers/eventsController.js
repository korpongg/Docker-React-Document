const sequelize = require("../config/dbConn").sequelize;
const Events = require("../models/Events");
const Occurrences = require("../models/Occurrences");
const User = require("../models/User");
const { executeAndStoreQueryResult } = require('../services/broadcastService');
const { findDepartmentEmail, sendEmailEvent, sendEmailEventHA } = require("./emailController");
const DataDict_Occurrence = require("./dataDictOccurrence");
const DB_NAME = process.env.DB_NAME;
const HA_EMAIL = process.env.HA_EMAIL;

// Utility function to format dates to SQL Server's format
const formatDate = (date) => date ? date.toISOString().replace("T", " ").replace("Z", "") : null;
// Utility function to format date to dd/mm/yyyy hh:mm:ss
const formatDateTime_N7 = (date) => {
  if (!date) return null;
    const d = new Date(date);

    const day = d.getUTCDate();
    const month = d.getUTCMonth() + 1;
    const year = d.getUTCFullYear();
    const hours = d.getUTCHours();
    const minutes = d.getUTCMinutes();
    const seconds = d.getUTCSeconds();

    // Pad single-digit day, month, hours, minutes, and seconds with leading zeros
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    
    return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Function to get title by code
function getTitleByCode(code, occurrences) {
  const codeString = code.toString();
  if (codeString === "199") {
    return occurrences.patientcareremark;
  } else if (codeString === "299") {
    return occurrences.patientsupportremark;
  } else if (codeString === "399") {
    return occurrences.utilityremark;
  } else if (codeString === "499") {
    return occurrences.equipmentremark;
  } else if (codeString === "599") {
    return occurrences.safetyremark;
  } else if (codeString === "699") {
    return occurrences.serviceremark;
  } else if (codeString === "799") {
    return occurrences.managementremark;
  } else {
    for (const key in DataDict_Occurrence) {
      const section = DataDict_Occurrence[key];
      const option = section.options.find((option) => option.code === parseInt(code));
      if (option) {
        return option.title;
      }
    }
  }
  return ``;
}

// Function to get title code
function getCodeTitle(code, occurrences) {
  const codeString = code.toString();
  const remarks = {
    "199": occurrences.patientcareremark,
    "299": occurrences.patientsupportremark,
    "399": occurrences.utilityremark,
    "499": occurrences.equipmentremark,
    "599": occurrences.safetyremark,
    "699": occurrences.serviceremark,
    "799": occurrences.managementremark,
  };
  if (remarks[codeString]) {
    return `อื่นๆ : ${remarks[codeString]}`;
  }
  
  for (const section of Object.values(DataDict_Occurrence)) {
    const option = section.options.find(option => option.code === parseInt(code));
    if (option) {
      return option.code;
    }
  }
  return '';
}

function getTopicByKey(key) {
  const section = DataDict_Occurrence[key];
  if (!section) {
    return ``;
  }

  return section.topic;
}

async function fetchResults(query, replacements) {
  return await sequelize.query(query, {
    replacements,
    type: sequelize.QueryTypes.SELECT
  });
}

function parseReportResults(results) {
  return results.map(report => {
    const { patientcare, patientsupport, utility, equipment, safety, service, management, ...rest } = report;

    const parseField = field => JSON.parse(report[field] || '[]');
    const patientcareP = parseField('patientcare');
    const patientsupportP = parseField('patientsupport');
    const utilityP = parseField('utility');
    const equipmentP = parseField('equipment');
    const safetyP = parseField('safety');
    const serviceP = parseField('service');
    const managementP = parseField('management');

    const reportCode = [];

    if (patientcareP.length) {
      reportCode.push(patientcareP.map(code => getCodeTitle(code, report)).join(", "));
    }
    if (patientsupportP.length) {
      if (reportCode.length) reportCode.push(", \n");
      reportCode.push(patientsupportP.map(code => getCodeTitle(code, report)).join(", "));
    }
    if (utilityP.length) {
      if (reportCode.length) reportCode.push(", \n");
      reportCode.push(utilityP.map(code => getCodeTitle(code, report)).join(", "));
    }
    if (equipmentP.length) {
      if (reportCode.length) reportCode.push(", \n");
      reportCode.push(equipmentP.map(code => getCodeTitle(code, report)).join(", "));
    }
    if (safetyP.length) {
      if (reportCode.length) reportCode.push(", \n");
      reportCode.push(safetyP.map(code => getCodeTitle(code, report)).join(", "));
    }
    if (serviceP.length) {
      if (reportCode.length) reportCode.push(", \n");
      reportCode.push(serviceP.map(code => getCodeTitle(code, report)).join(", "));
    }
    if (managementP.length) {
      if (reportCode.length) reportCode.push(", \n");
      reportCode.push(managementP.map(code => getCodeTitle(code, report)).join(", "));
    }

    return {
      ...rest,
      reportcode: reportCode.join(""),
    };
  });
}

// Get Report
exports.rePort = async (req, res) => {
  // const startDate = req?.params?.startdate;
  // const endDate = req?.params?.enddate;
  const { startdate, enddate } = req.params;

  // try {
  //   // Query
  //   let eventQuery = `
  //     DECLARE @StartDate DATE, @EndDate DATE;
  //     SET @StartDate = :startdate;
  //     SET @EndDate = :enddate;
      
  //     SELECT e.id,
  //     e.reportid,
  //     e.code,
  //     CASE WHEN o.hn IS NULL THEN o.an ELSE o.hn END AS hn,
  //     o.occurrencedate,
  //     d.name as depname,
  //     CASE WHEN o.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename,
  //     o.level,
  //     e.summarydetail,
  //     o.renew,
  //     --o.activefailure,
  //     e.factors,
  //     e.comment,
  //     e.suggestion,
  //     e.forwardtxt,
  //     u.dep AS requestdep,
  //     u.affiliation AS requestaff,
  //     CASE WHEN o.type = 'ipd' THEN 'IPD' ELSE 'OPD' END AS occtype
  //     FROM ${DB_NAME}.[dbo].[event_logs] e
  //     LEFT JOIN ${DB_NAME}.[dbo].[occurrences] o ON o.reportid = e.reportid
  //     LEFT JOIN ${DB_NAME}.[dbo].[user] u ON u.userid = o.createby
  //     LEFT JOIN ${DB_NAME}.[dbo].[department] d ON d.id = e.deptrelate
  //   `;
    
  //   // Add the WHERE clause based on the provided dates
  //   if (startDate && endDate) {
  //     eventQuery += ` WHERE CAST(o.[occurrencedate] AS date) BETWEEN CAST(@StartDate AS date) AND CAST(@EndDate AS date)`;
  //   } else if (startDate) {
  //     eventQuery += ` WHERE CAST(o.[occurrencedate] AS date) = CAST(@StartDate AS date)`;
  //   }
    
  //   // Execute the query with replacements for the dates
  //   const results = await sequelize.query(eventQuery, {
  //     replacements: {
  //       startdate: startDate ? startDate : null,
  //       enddate: endDate ? endDate : null
  //     },
  //     type: sequelize.QueryTypes.SELECT
  //   });
    
  //   return res.status(200).json(results);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }

  const baseQuery = `
    DECLARE @StartDate DATE, @EndDate DATE;
    SET @StartDate = :startdate;
    SET @EndDate = :enddate;
    
    SELECT e.id,
      e.reportid,
      e.code,
      COALESCE(o.hn, o.an) AS hn,
      o.occurrencedate,
      d.name as depname,
      CASE WHEN o.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename,
      o.level,
      e.summarydetail,
      o.renew,
      --o.activefailure,
      e.factors,
      e.comment,
      e.suggestion,
      e.forwardtxt,
      u.dep AS requestdep,
      u.affiliation AS requestaff,
      CASE WHEN o.type = 'ipd' THEN 'IPD' ELSE 'OPD' END AS occtype,
      o.patientcare,
      o.patientsupport,
      o.utility,
      o.equipment,
      o.safety,
      o.service,
      o.management,
      CASE WHEN d.name = u.dep THEN 'SR' ELSE 'NR' END AS selfreport,
      CASE WHEN DATEDIFF(hour, o.occurrencedate, o.createAt) < 24 THEN 1  ELSE 0 END AS timelyreport
    FROM ${DB_NAME}.[dbo].[event_logs] e
    LEFT JOIN ${DB_NAME}.[dbo].[occurrences] o ON o.reportid = e.reportid
    LEFT JOIN ${DB_NAME}.[dbo].[user] u ON u.userid = o.createby
    LEFT JOIN ${DB_NAME}.[dbo].[department] d ON d.id = e.deptrelate
  `;
  
  const whereClause = startdate && enddate
    ? ` WHERE CAST(o.[occurrencedate] AS date) BETWEEN CAST(@StartDate AS date) AND CAST(@EndDate AS date)`
    : startdate ? ` WHERE CAST(o.[occurrencedate] AS date) = CAST(@StartDate AS date)` : '';

  const query = baseQuery + whereClause;

  try {
    const results = await fetchResults(query, { startdate, enddate });
    if (results.length) {
      const parsedResults = parseReportResults(results);
      res.status(200).json(parsedResults);
    } else {
      res.status(204).json({ error: "Report not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new report log
exports.createEventtLog = async (req, res) => {
  try {
    const { reportid, status, acceptAt, responsedate, ...otherData } = req.body;
    const formattedAcceptDate = formatDate(acceptAt ? new Date(acceptAt) : null);
    const formattedResponseDate = formatDate(responsedate ? new Date(responsedate) : null);

    // Find all events with the same reportid
    const existingEvents = await Events.findAll({ where: { reportid } });

    // Generate code based on the count of existing events
    // const eventCount = await Events.count({ where: { reportid } }) + 1;
    const eventCount = existingEvents.length + 1;
    const newCode = `${reportid}-${String(eventCount).padStart(2, "0")}`;

    const result = await Events.create({
      ...otherData,
      reportid,
      code: newCode,
      status: status || '1',
      acceptAt: formattedAcceptDate ? sequelize.literal(`'${formattedAcceptDate}'`) : null,
      responsedate: formattedResponseDate ? sequelize.literal(`'${formattedResponseDate}'`) : null,
    });

    // Update the Occurrences table
    await Occurrences.update({ formstatus: '4' }, { where: { reportid } });

    // Fetch Occurrences data for the reportid
    const occurrences = await Occurrences.findOne({ where: { reportid } });
    if (occurrences) {
      // console.log(occurrences);
      const renewDesc = req.body.summarydetail.replace(/\n/g, '<br/>');
  
      // Map patientcare
      const patientcare = JSON.parse(occurrences.patientcare || '[]');
      const patientcareDetails = patientcare.length > 0 ? patientcare.map(code => {
        const title = getTitleByCode(code, occurrences);
        return `${title} (${code})`;
      }).join(", ") : null;

      // Map patientsupport
      const patientsupport = JSON.parse(occurrences.patientsupport || '[]');
      const patientsupportDetails = patientsupport.length > 0 ? patientsupport.map(code => {
        const title = getTitleByCode(code, occurrences);
        return `${title} (${code})`;
      }).join(", ") : null;
      
      // Map utility
      const utility = JSON.parse(occurrences.utility || '[]');
      const utilityDetails = utility.length > 0 ? utility.map(code => {
        const title = getTitleByCode(code, occurrences);
        return `${title} (${code})`;
      }).join(", ") : null;
      
      // Map equipment
      const equipment = JSON.parse(occurrences.equipment || '[]');
      const equipmentDetails = equipment.length > 0 ? equipment.map(code => {
        const title = getTitleByCode(code, occurrences);
        return `${title} (${code})`;
      }).join(", ") : null;
      
      // Map safety
      const safety = JSON.parse(occurrences.safety || '[]');
      const safetyDetails = safety.length > 0 ? safety.map(code => {
        const title = getTitleByCode(code, occurrences);
        return `${title} (${code})`;
      }).join(", ") : null;
      
      // Map service
      const service = JSON.parse(occurrences.service || '[]');
      const serviceDetails = service.length > 0 ? service.map(code => {
        const title = getTitleByCode(code, occurrences);
        return `${title} (${code})`;
      }).join(", ") : null;
      
      // Map management
      const management = JSON.parse(occurrences.management || '[]');
      const managementDetails = management.length > 0 ? management.map(code => {
        const title = getTitleByCode(code, occurrences);
        return `${title} (${code})`;
      }).join(", ") : null;
      
      // Send email
      const emailSubject = "รายงานอุบัติการณ์ เลขที่เอกสาร: " + newCode;
      // const emailMessage ="เลขที่เอกสาร: " + newCode + `<br/><br/>` + "มีรายงานอุบัติการณ์ถึงหน่วยงาน";
      const emailMessage = `
        เลขที่เอกสาร: ${newCode}<br/><br/>
        มีรายงานอุบัติการณ์ถึงหน่วยงาน<br/><br/>
        <strong>รายละเอียดอุบัติการณ์:</strong><br/>
        เกิดเมื่อ: ${formatDateTime_N7(occurrences.occurrencedate)}<br/>
        ประเภท: ${occurrences.reporttype === '0' ? 'General Risk' : 'Clinical Risk'}<br/>
        ระดับความรุนแรง: ${occurrences.level}<br/><br/>
        ${patientcareDetails ? `<u>${getTopicByKey('patientcare')}:</u> ${patientcareDetails}<br/><br/>` : ""}
        ${patientsupportDetails ? `<u>${getTopicByKey('patientsupport')}:</u> ${patientsupportDetails}<br/><br/>` : ""}
        ${utilityDetails ? `<u>${getTopicByKey('utility')}:</u> ${utilityDetails}<br/><br/>` : ""}
        ${equipmentDetails ? `<u>${getTopicByKey('equipment')}:</u> ${equipmentDetails}<br/><br/>` : ""}
        ${safetyDetails ? `<u>${getTopicByKey('safety')}:</u> ${safetyDetails}<br/><br/>` : ""}
        ${serviceDetails ? `<u>${getTopicByKey('service')}:</u> ${serviceDetails}<br/><br/>` : ""}
        ${managementDetails ? `<u>${getTopicByKey('management')}:</u> ${managementDetails}<br/><br/>` : ""}
        <u>สรุปเหตุการณ์ไม่พึงประสงค์:</u><br/> ${renewDesc}
      `;
      const recipientEmail = await findDepartmentEmail(newCode);
      // const recipientEmail = "nateeton.l@thainakarin.co.th";
      sendEmailEvent(recipientEmail, emailSubject, emailMessage);
    }

    executeAndStoreQueryResult();
    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all report logs
// exports.getAllEventLogs = async (req, res) => {
//   try {
//     const events = await Events.findAll({
//       include: [
//         { model: User, attributes: ['name', 'lastname'], as: 'CreateBy' },
//         { model: User, attributes: ['name', 'lastname'], as: 'AcceptBy' }
//       ],
//     });

//     if (!events || events.length === 0) {
//       return res.status(404).json({ message: "No event logs found" });
//     }
    
//     // Map the events to include "createname" field
//     const mappedEvents = events.map(event => {
//       const createdBy = event.CreateBy;
//       const createname = createdBy ? `${createdBy.name} ${createdBy.lastname}` : null;
//       const acceptBy = event.AcceptBy;
//       const acceptname = acceptBy ? `${acceptBy.name} ${acceptBy.lastname}` : null;
//       return {
//         ...event.toJSON(),
//         createname: createname,
//         acceptname: acceptname
//       };
//     }).map(({ CreateBy, AcceptBy, ...event }) => event); // Exclude CreateBy key from the result

//     res.status(200).json(mappedEvents);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Get all event log by Report ID
exports.getAllEventLogs = async (req, res) => {
  try {
    const reportId = req.params.reportid;

    const query = `
      SELECT e.id,
      e.reportid,
      e.code,
      CASE WHEN o.hn IS NULL THEN o.an ELSE o.hn END AS hn,
      o.occurrencedate,
      e.deptrelate,
      d.name as depname,
      CASE WHEN o.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename,
      o.level,
      -- o.description,
      e.comment,
      e.suggestion,
      e.forwardtxt,
      e.summarydetail,
      o.activefailure,
      e.urgenttype,
      e.isnew,
      e.status,
      e.createby,
      e.createAt,
      e.acceptby,
      e.acceptAt,
      e.repeatAt,
      e.responsedate
      FROM ${DB_NAME}.[dbo].[event_logs] e
      LEFT JOIN ${DB_NAME}.[dbo].[occurrences] o ON o.reportid = e.reportid
      LEFT JOIN ${DB_NAME}.[dbo].[department] d ON d.id = e.deptrelate
      WHERE e.reportid = :reportId
      ORDER BY e.createAt DESC
    `;

    const events = await sequelize.query(query, {
      replacements: { reportId: reportId },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "Event log not found" });
    }

    // Debugging: Log the events fetched from the query
    // console.log("Fetched events:", events);

    // Optionally, map events to include createname and acceptname
    const mappedEvents = await Promise.all(events.map(async event => {
      // Debugging: Log the createby and acceptby IDs
      // console.log("Processing event:", event.id, "createby:", event.createby, "acceptby:", event.acceptby);

      const createdByUser = event.createby ? await User.findOne({ where: { userid: event.createby }, attributes: ['name', 'lastname'] }) : null;
      const acceptedByUser = event.acceptby ? await User.findOne({ where: { userid: event.acceptby }, attributes: ['name', 'lastname'] }) : null;

      // Debugging: Log the fetched user details
      // console.log("Created by user:", createdByUser);
      // console.log("Accepted by user:", acceptedByUser);

      return {
        ...event,
        createname: createdByUser ? `${createdByUser.name} ${createdByUser.lastname}` : null,
        acceptname: acceptedByUser ? `${acceptedByUser.name} ${acceptedByUser.lastname}` : null,
      };
    }));

    res.status(200).json(mappedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.getEventLogById = async (req, res) => {
//   try {
//     const events = await Events.findAll({
//       where: { reportid: req.params.id },
//       include: [
//         { model: User, attributes: ['name', 'lastname'], as: 'CreateBy' },
//         { model: User, attributes: ['name', 'lastname'], as: 'AcceptBy' }
//       ],
//       order: [["createAt", "DESC"]],
//     });

//     if (!events || events.length === 0) {
//       res.status(404).json({ message: "Event log not found" });
//       return;
//     }
    
//     // Map the events to include "createname" field
//     const mappedEvents = events.map(event => {
//       const createdBy = event.CreateBy;
//       const createname = createdBy ? `${createdBy.name} ${createdBy.lastname}` : null;
//       const acceptBy = event.AcceptBy;
//       const acceptname = acceptBy ? `${acceptBy.name} ${acceptBy.lastname}` : null;
//       return {
//         ...event.toJSON(),
//         createname: createname,
//         acceptname: acceptname
//       };
//     }).map(({ CreateBy, AcceptBy, ...event }) => event); // Exclude CreateBy key from the result

//     res.status(200).json(mappedEvents);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.getEventLogById = async (req, res) => {
  try {
    const reportId = req.params.reportid;
    const ID = req.params.id;

    const query = `
      SELECT e.id,
      e.reportid,
      e.code,
      CASE WHEN o.hn IS NULL THEN o.an ELSE o.hn END AS hn,
      o.occurrencedate,
      e.deptrelate,
      d.name as depname,
      CASE WHEN o.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename,
      o.level,
      -- o.description,
      e.comment,
      e.suggestion,
      e.forwardtxt,
      e.summarydetail,
      o.activefailure,
      e.urgenttype,
      e.isnew,
      e.status,
      e.createby,
      e.createAt,
      e.acceptby,
      e.acceptAt,
      e.repeatAt,
      e.responsedate
      FROM ${DB_NAME}.[dbo].[event_logs] e
      LEFT JOIN ${DB_NAME}.[dbo].[occurrences] o ON o.reportid = e.reportid
      LEFT JOIN ${DB_NAME}.[dbo].[department] d ON d.id = e.deptrelate
      WHERE e.reportid = :reportId
      AND e.id = :id
      ORDER BY e.createAt DESC;
    `;

    const events = await sequelize.query(query, {
      replacements: { reportId: reportId, id: ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "Event log not found" });
    }

    // Debugging: Log the events fetched from the query
    // console.log("Fetched events:", events);

    // Optionally, map events to include createname and acceptname
    const mappedEvents = await Promise.all(events.map(async event => {
      // Debugging: Log the createby and acceptby IDs
      // console.log("Processing event:", event.id, "createby:", event.createby, "acceptby:", event.acceptby);

      const createdByUser = event.createby ? await User.findOne({ where: { userid: event.createby }, attributes: ['name', 'lastname'] }) : null;
      const acceptedByUser = event.acceptby ? await User.findOne({ where: { userid: event.acceptby }, attributes: ['name', 'lastname'] }) : null;

      // Debugging: Log the fetched user details
      // console.log("Created by user:", createdByUser);
      // console.log("Accepted by user:", acceptedByUser);

      return {
        ...event,
        createname: createdByUser ? `${createdByUser.name} ${createdByUser.lastname}` : null,
        acceptname: acceptedByUser ? `${acceptedByUser.name} ${acceptedByUser.lastname}` : null,
      };
    }));

    res.status(200).json(mappedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a report log by ID
exports.updateEventLog = async (req, res) => {
  try {
    const events = await Events.findByPk(req.params.id);
    if (!events) {
      return res.status(404).json({ message: "Event log not found" });
    }
    
    // Check if req.body.comment is not an empty string
    if (req.body.comment && req.body.comment.trim() !== "") {
      req.body.status = '2';
      req.body.acceptAt = sequelize.literal("CURRENT_TIMESTAMP");
    }

    // Repeat Event
    if (req.body.status === '3') {
      req.body.repeatAt = sequelize.literal("CURRENT_TIMESTAMP");
    }

    await events.update(req.body);

    const { code, status } = events.dataValues;
    let emailSubject, emailMessage, recipientEmail;

    // Send email
    if (status === '2'){
      emailSubject = `รายงานอุบัติการณ์ เลขที่เอกสาร: ${code}`;
      emailMessage = `เลขที่เอกสาร: ${code}<br/><br/>หน่วยงานทำการบันทึกผลการทบทวนอุบัติการณ์แล้ว`;
      recipientEmail = HA_EMAIL;
      sendEmailEventHA(recipientEmail, emailSubject, emailMessage);
    } else if (status === '3') {
      emailSubject = `รายงานอุบัติการณ์ เลขที่เอกสาร: ${code}`;
      emailMessage = `เลขที่เอกสาร: ${code}<br/><br/>มีรายงานส่งทบทวนอุบัติการณ์ถึงหน่วยงาน`;
      recipientEmail = await findDepartmentEmail(code);
      // recipientEmail = "nateeton.l@thainakarin.co.th";
      sendEmailEvent(recipientEmail, emailSubject, emailMessage);
    }

    executeAndStoreQueryResult();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a report log by ID
exports.deleteEventLog = async (req, res) => {
  try {
    const events = await Events.findByPk(req.params.id);
    if (!events) {
      return res.status(404).json({ message: "Report log not found" });
    }
    await events.destroy();

    executeAndStoreQueryResult();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};