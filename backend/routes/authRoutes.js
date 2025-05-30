const express = require('express');
const router = express.Router();

const {
  registerCompany,
  loginCompany,
  registerInterviewer,
  loginInterviewer
} = require('../controllers/authController');

// Company routes
router.post('/company/register', registerCompany);
router.post('/company/login', loginCompany);

// Interviewer routes
router.post('/interviewer/register', registerInterviewer);
router.post('/interviewer/login', loginInterviewer);

module.exports = router; 