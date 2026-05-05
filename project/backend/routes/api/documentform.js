const express = require("express");
const router = express.Router();
const documentformController = require("../../controllers/documentformController");
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
router.post("/", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'), documentformController.createOccurrence);

// Get all occurrences
// router.get('/', occurrencesController.getAllOccurrences);

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), documentformController.getAllOccurrences)
  .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'), documentformController.updateOccurrence);

// Get a single occurrence by ID
router.get("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), documentformController.getOccurrenceById);
router.get("/viewform/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), documentformController.getOccurrenceViewFormById);

router.get("/getComplainant/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), documentformController.getComplainantById);

// Update an occurrence by ID
// router.put('/:id', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin),  documentformController.updateOccurrence);

// Delete an occurrence by ID
router.delete("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), documentformController.deleteOccurrence);

module.exports = router;
