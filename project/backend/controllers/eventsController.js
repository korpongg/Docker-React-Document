const sequelize = require("../config/dbConn").sequelize;
const Events = require("../models/Events");
const Occurrences = require("../models/Occurrences");
const User = require("../models/User");
const { executeAndStoreQueryResult } = require('../services/broadcastService');

// Utility function to format dates to SQL Server's format
const formatDate = (date) => date ? date.toISOString().replace("T", " ").replace("Z", "") : null;

// Create a new report log
exports.createEventtLog = async (req, res) => {
  try {
    const { reportid, acceptAt, responsedate, ...otherData } = req.body;
    const formattedAcceptDate = formatDate(acceptAt ? new Date(acceptAt) : null);
    const formattedResponseDate = formatDate(responsedate ? new Date(responsedate) : null);

    // Find all events with the same reportid
    const existingEvents = await Events.findAll({ where: { reportid } });

    // Generate code based on the count of existing events
    const eventCount = existingEvents.length + 1;
    const newCode = `${reportid}-${String(eventCount).padStart(2, "0")}`;

    const result = await Events.create({
      ...otherData,
      reportid,
      code: newCode,
      status: '1',
      acceptAt: formattedAcceptDate ? sequelize.literal(`'${formattedAcceptDate}'`) : null,
      responsedate: formattedResponseDate ? sequelize.literal(`'${formattedResponseDate}'`) : null,
    });

    // Update the Occurrences table
    await Occurrences.update(
      { formstatus: '4' },
      { where: { reportid: reportid } }
    );

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
      FROM [occurrence].[dbo].[event_logs] e
      LEFT JOIN [occurrence].[dbo].[occurrences] o ON o.reportid = e.reportid
      LEFT JOIN [occurrence].[dbo].[department] d ON d.id = e.deptrelate
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
      FROM [occurrence].[dbo].[event_logs] e
      LEFT JOIN [occurrence].[dbo].[occurrences] o ON o.reportid = e.reportid
      LEFT JOIN [occurrence].[dbo].[department] d ON d.id = e.deptrelate
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