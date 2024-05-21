const express = require("express");
const router = express.Router();
const affiliationController = require("../../controllers/affiliationController");

// Affiliation Routes
// router.post("/", affiliationController.createAffiliation);
router.get("/", affiliationController.getAllAffiliations);
router.get("/:id", affiliationController.getAffiliationById);
// router.put("/:id", affiliationController.updateAffiliation);
// router.delete("/:id", affiliationController.deleteAffiliation);

module.exports = router;