const sequelize = require("../config/dbConn").sequelize;
const Faction = require('../models/Faction');

// Create a new faction
exports.createFaction = async (req, res) => {
  try {
    const faction = await Faction.create(req.body);
    res.status(201).json(faction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all factions
exports.getAllFactions = async (req, res) => {
  try {
    const factions = await Faction.findAll();
    res.status(200).json(factions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single faction by ID
exports.getFactionById = async (req, res) => {
  try {
    const faction = await Faction.findByPk(req.params.id);
    if (faction) {
      res.status(200).json(faction);
    } else {
      res.status(404).json({ message: 'Faction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a faction
exports.updateFaction = async (req, res) => {
  try {
    const [updated] = await Faction.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedFaction = await Faction.findByPk(req.params.id);
      res.status(200).json(updatedFaction);
    } else {
      res.status(404).json({ message: 'Faction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a faction
exports.deleteFaction = async (req, res) => {
  try {
    const deleted = await Faction.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Faction deleted' });
    } else {
      res.status(404).json({ message: 'Faction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
