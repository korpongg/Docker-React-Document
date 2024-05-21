const sequelize = require("../config/dbConn").sequelize;
const Events = require("../models/Events");
const User = require("../models/User");

// Utility function to format dates to SQL Server's format
const formatDate = (date) => date ? date.toISOString().replace("T", " ").replace("Z", "") : null;

// Create a new report log
exports.createReportLog = async (req, res) => {
  try {
    const { reportid, acceptdate, responsedate, ...otherData } = req.body;
    const formattedAcceptDate = formatDate(acceptdate ? new Date(acceptdate) : null);
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
      acceptdate: formattedAcceptDate ? sequelize.literal(`'${formattedAcceptDate}'`) : null,
      responsedate: formattedResponseDate ? sequelize.literal(`'${formattedResponseDate}'`) : null,
    });

    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all report logs
exports.getAllReportLogs = async (req, res) => {
  try {
    const events = await Events.findAll({
      include: [
        { model: User, attributes: ['name', 'lastname'], as: 'CreateBy' },
        { model: User, attributes: ['name', 'lastname'], as: 'AcceptBy' }
      ],
    });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No event logs found" });
    }
    
    // Map the events to include "createname" field
    const mappedEvents = events.map(event => {
      const createdBy = event.CreateBy;
      const createname = createdBy ? `${createdBy.name} ${createdBy.lastname}` : null;
      const acceptBy = event.AcceptBy;
      const acceptname = acceptBy ? `${acceptBy.name} ${acceptBy.lastname}` : null;
      return {
        ...event.toJSON(),
        createname: createname,
        acceptname: acceptname
      };
    }).map(({ CreateBy, AcceptBy, ...event }) => event); // Exclude CreateBy key from the result

    res.status(200).json(mappedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single report log by ID
exports.getReportLogById = async (req, res) => {
  try {
    const events = await Events.findAll({
      where: { reportid: req.params.id },
      include: [
        { model: User, attributes: ['name', 'lastname'], as: 'CreateBy' },
        { model: User, attributes: ['name', 'lastname'], as: 'AcceptBy' }
      ],
      order: [["createAt", "DESC"]],
    });

    if (!events || events.length === 0) {
      res.status(404).json({ message: "Event log not found" });
      return;
    }
    
    // Map the events to include "createname" field
    const mappedEvents = events.map(event => {
      const createdBy = event.CreateBy;
      const createname = createdBy ? `${createdBy.name} ${createdBy.lastname}` : null;
      const acceptBy = event.AcceptBy;
      const acceptname = acceptBy ? `${acceptBy.name} ${acceptBy.lastname}` : null;
      return {
        ...event.toJSON(),
        createname: createname,
        acceptname: acceptname
      };
    }).map(({ CreateBy, AcceptBy, ...event }) => event); // Exclude CreateBy key from the result

    res.status(200).json(mappedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a report log by ID
exports.updateReportLog = async (req, res) => {
  try {
    const events = await Events.findByPk(req.params.id);
    if (!events) {
      return res.status(404).json({ message: "Report log not found" });
    }
    
    // Check if req.body.comment is not an empty string
    if (req.body.comment && req.body.comment.trim() !== "") {
      req.body.status = '2';
      req.body.acceptdate = sequelize.literal("CURRENT_TIMESTAMP");
    }

    await events.update(req.body);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a report log by ID
exports.deleteReportLog = async (req, res) => {
  try {
    const events = await Events.findByPk(req.params.id);
    if (!events) {
      return res.status(404).json({ message: "Report log not found" });
    }
    await events.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};