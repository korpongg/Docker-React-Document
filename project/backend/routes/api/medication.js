const express = require("express");
const router = express.Router();
const medicationController = require("../../controllers/medicationController");
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

// Get Report with optional startdate and enddate
router.get('/reports/:startdate?/:enddate?', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), medicationController.rePort);

// Create a new medication
router.post("/", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'), medicationController.createMedication);

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), medicationController.getAllMedications)
  .put(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), upload.array('files'), medicationController.updateMedication);

// Get a single medication by ID
router.get("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), medicationController.getMedicationById);

// Delete an medication by ID
router.delete("/:id/:userid", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), medicationController.deleteMedication);

module.exports = router;
