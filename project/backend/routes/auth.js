const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
console.log('auth route file loaded');

router.post('/', authController.handleLogin);

module.exports = router;