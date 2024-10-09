const express = require("express");
const router = express.Router();
const supController = require("../../controllers/supervisorController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// Supervisor Routes
router.post("/", verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), supController.createSupervisor);

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), supController.getAllSupervisor);

router.get("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), supController.getSupervisorById);

router.put("/:id", verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), supController.updateSupervisor);

router.delete("/:id", verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), supController.deleteSupervisor);

module.exports = router;