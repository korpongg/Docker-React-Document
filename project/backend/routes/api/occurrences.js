const express = require("express");
const router = express.Router();
const occurrencesController = require("../../controllers/occurrenceController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// Create a new occurrence
router.post("/", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), occurrencesController.createOccurrence);

// Get all occurrences
// router.get('/', occurrencesController.getAllOccurrences);

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), occurrencesController.getAllOccurrences)
  .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), occurrencesController.updateOccurrence);

// Get a single occurrence by ID
router.get("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), occurrencesController.getOccurrenceById);

// Update an occurrence by ID
// router.put('/:id', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin),  occurrencesController.updateOccurrence);

// Delete an occurrence by ID
router.delete("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), occurrencesController.deleteOccurrence);

module.exports = router;
