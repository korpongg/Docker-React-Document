const sequelize = require("../config/dbConn").sequelize;
const Affiliation = require('../models/Affiliation');

// Create a new affiliation
exports.createAffiliation = async (req, res) => {
  try {
    const affiliation = await Affiliation.create(req.body);
    res.status(201).json(affiliation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all affiliations
exports.getAllAffiliations = async (req, res) => {
  try {
    const affiliations = await Affiliation.findAll();
    res.status(200).json(affiliations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single affiliation by ID
exports.getAffiliationById = async (req, res) => {
  try {
    const affiliation = await Affiliation.findByPk(req.params.id);
    if (affiliation) {
      res.status(200).json(affiliation);
    } else {
      res.status(404).json({ message: 'Affiliation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an affiliation
exports.updateAffiliation = async (req, res) => {
  try {
    const [updated] = await Affiliation.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedAffiliation = await Affiliation.findByPk(req.params.id);
      res.status(200).json(updatedAffiliation);
    } else {
      res.status(404).json({ message: 'Affiliation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an affiliation
exports.deleteAffiliation = async (req, res) => {
  try {
    const deleted = await Affiliation.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Affiliation deleted' });
    } else {
      res.status(404).json({ message: 'Affiliation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
