const express = require("express");
const router = express.Router();
const medicationController = require("../../controllers/medicationController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// Get Report with optional startdate and enddate
router.get('/reports/:startdate?/:enddate?', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), medicationController.rePort);

// Create a new occurrence
router.post("/", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), medicationController.createMedication);

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), medicationController.getAllMedications)
  .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), medicationController.updateMedication);

// Get a single occurrence by ID
router.get("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), medicationController.getMedicationById);

// Delete an occurrence by ID
router.delete("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), medicationController.deleteMedication);

module.exports = router;
