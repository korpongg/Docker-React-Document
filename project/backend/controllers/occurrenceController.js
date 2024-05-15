const sequelize = require("../config/dbConn").sequelize; // Import the sequelize instance
const Occurrences = require("../models/Occurrences"); // Adjust the path as necessary
const moment = require('moment-timezone');

// Create a new occurrence
exports.createOccurrence = async (req, res) => {
  try {

    // Get the current year and month
    const currentYear = new Date().getFullYear().toString().slice(-2); // Extract last two digits of the year
    const currentMonth = (new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Get current month and ensure it's zero-padded
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
      createAt: sequelize.literal("CURRENT_TIMESTAMP"),
      reportid: reportId, // Assign the generated reportId
    });

    // console.log(result)
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all occurrences
exports.getAllOccurrences = async (req, res) => {
  try {
    const occurrences = await Occurrences.findAll();
    res.status(200).json(occurrences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single occurrence by ID
exports.getOccurrenceById = async (req, res) => {
  try {
    const occurrence = await Occurrences.findByPk(req.params.id);
    if (!occurrence) {
      return res.status(404).json({ error: "Occurrence not found" });
    }
    res.status(200).json(occurrence);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an occurrence by ID
exports.updateOccurrence = async (req, res) => {
  if (!req?.body?.reportid) {
    return res.status(400).json({ message: "reportid is required." });
  }

  const reportid = req?.body?.reportid;

  try {
    const occurrence = await Occurrences.findOne({ where: { reportid: reportid } });
    // const [updated] = await Occurrences.update(req.body, {
    //   where: { id: req.params.id },
    // });
    if (!occurrence) {
      return res.status(204).json({ message: `No Occurrences matches ID ${req.body.reportid}.` });
    }

    // Check if req.body.occurrencedate is provided and parse it
    if (req.body.occurrencedate) {
      const occurrencedate = new Date(req.body.occurrencedate);
      const formattedOccurrenceDate = occurrencedate.toISOString().replace('T', ' ').replace('Z', '');
      req.body.occurrencedate = sequelize.literal(`'${formattedOccurrenceDate}'`);
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
    // Additional logging after saving
    console.log("After saving Occurrences:");
    console.log(result.toJSON());

    // const updatedOccurrence = await Occurrences.findByPk(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an occurrence by ID
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
  try {
    const deleted = await Occurrences.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Occurrence not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
