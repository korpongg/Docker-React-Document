const express = require("express");
const router = express.Router();
const occurrencesController = require("../../controllers/occurrenceController");
const multer = require('multer');
const path = require('path');
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// Set up multer storage for file uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, process.env.DB_STORE));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Create a new occurrence
router.post("/", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'), occurrencesController.createOccurrence);

// Get all occurrences
// router.get('/', occurrencesController.getAllOccurrences);

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), occurrencesController.getAllOccurrences)
  .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'), occurrencesController.updateOccurrence);

// Get a single occurrence by ID
router.get("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), occurrencesController.getOccurrenceById);

// Update an occurrence by ID
// router.put('/:id', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin),  occurrencesController.updateOccurrence);

// Delete an occurrence by ID
router.delete("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), occurrencesController.deleteOccurrence);

module.exports = router;
