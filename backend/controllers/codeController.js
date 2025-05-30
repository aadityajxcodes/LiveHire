const codeExecutionService = require('../services/codeExecutionService');
const Interview = require('../models/Interview');

exports.executeCode = async (req, res) => {
  try {
    const { code, language, interviewId } = req.body;

    // Validate input
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    // If interviewId is provided, verify the user is part of the interview
    if (interviewId) {
      const interview = await Interview.findById(interviewId);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found' });
      }

      const isParticipant = 
        interview.interviewer.toString() === req.user._id.toString() ||
        interview.company.toString() === req.user._id.toString();

      if (!isParticipant) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Update the code in the interview document
      interview.codingTest.code = code;
      await interview.save();
    }

    // Execute the code
    const result = await codeExecutionService.executeCode(code, language);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ output: result.output });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
};

exports.saveCode = async (req, res) => {
  try {
    const { code, language, interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({ error: 'Interview ID is required' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const isParticipant = 
      interview.interviewer.toString() === req.user._id.toString() ||
      interview.company.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update the code in the interview document
    interview.codingTest.code = code;
    await interview.save();

    res.json({ message: 'Code saved successfully' });
  } catch (error) {
    console.error('Error saving code:', error);
    res.status(500).json({ error: 'Failed to save code' });
  }
};

exports.getCode = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const isParticipant = 
      interview.interviewer.toString() === req.user._id.toString() ||
      interview.company.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({
      code: interview.codingTest.code || '',
      language: interview.codingTest.language || 'javascript'
    });
  } catch (error) {
    console.error('Error fetching code:', error);
    res.status(500).json({ error: 'Failed to fetch code' });
  }
};