const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  executeCode,
  saveCode,
  getCode
} = require('../controllers/codeController');

// Code execution routes
router.post('/execute', authenticateUser, executeCode);
router.post('/save', authenticateUser, saveCode);
router.get('/:interviewId', authenticateUser, getCode);

module.exports = router;