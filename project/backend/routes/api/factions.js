const express = require("express");
const router = express.Router();
const factionController = require("../../controllers/factionController");

// Faction Routes
// router.post("/", factionController.createFaction);
router.get("/", factionController.getAllFactions);
router.get("/:id", factionController.getFactionById);
// router.put("/:id", factionController.updateFaction);
// router.delete("/:id", factionController.deleteFaction);

module.exports = router;