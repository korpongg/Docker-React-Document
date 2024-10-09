const express = require("express");
const router = express.Router();
const supController = require("../../controllers/supervisorController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.get("/:userid", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), supController.getSupervisorByUserId);

module.exports = router;