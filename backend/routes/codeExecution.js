const express = require('express');
const router = express.Router();
const codeExecutionService = require('../services/codeExecutionService');
const { authenticateToken } = require('../middleware/auth');

// Execute code
router.post('/execute', authenticateToken, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        message: 'Code and language are required'
      });
    }

    const result = await codeExecutionService.executeCode(code, language);
    res.json(result);

  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      message: 'Code execution failed',
      error: error.message
    });
  }
});

module.exports = router; 