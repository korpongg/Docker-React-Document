const express = require("express");
const router = express.Router();
const eventsController = require("../../controllers/eventsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.post('/', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.createReportLog);
router.get('/', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.getAllReportLogs);
router.get('/:id', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.getReportLogById);
// router.put('/:id', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.updateReportLog);
// router.delete('/:id', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.deleteReportLog);

module.exports = router;