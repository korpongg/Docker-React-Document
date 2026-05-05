const express = require("express");
const router = express.Router();
const documentsController = require("../../controllers/documentController");
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
router.post("/", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'), documentsController.createOccurrence);

router.post("/updateOccurrence", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'), documentsController.updateOccurrence);


// Get all occurrences
// router.get('/', occurrencesController.getAllOccurrences);

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), documentsController.getAllOccurrences)
  .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), documentsController.updateOccurrence);

// Get a single occurrence by ID
router.get("/:reportid", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), documentsController.getOccurrenceById);

// Update an occurrence by ID
// router.put('/:id', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin),  documentsController.updateOccurrence);

// Delete an occurrence by ID
router.delete("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), documentsController.deleteOccurrence);
router.post("/updatereply", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'),  documentsController.updateReply);
router.post("/submitmanager", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'),  documentsController.submitManager);
router.post("/submitExecutive", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'),  documentsController.submitExecutive);

module.exports = router;
