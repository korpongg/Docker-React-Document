const express = require("express");
const router = express.Router();
const eventsController = require("../../controllers/eventsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// Get Report with optional startdate and enddate
router.get('/reports/:startdate?/:enddate?', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), eventsController.rePort);

router.post('/', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.createEventtLog);
// router.get('/', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.getAllEventLogs);
router.get('/:reportid', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.getAllEventLogs);
router.get('/:reportid/:id', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.getEventLogById);
router.put('/:id', verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.updateEventLog);
router.delete('/:id', verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), eventsController.deleteEventLog);

module.exports = router;