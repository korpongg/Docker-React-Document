const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// Create a new user
router.post("/", verifyRoles(ROLES_LIST.Admin), usersController.createUser);

router.route("/")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
  .put(verifyRoles(ROLES_LIST.Admin), usersController.updateUser);

router.route("/:userid").get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), usersController.getUser);

module.exports = router;