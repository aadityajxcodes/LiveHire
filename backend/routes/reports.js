const express = require('express');
const router = express.Router();
const InterviewReport = require('../models/InterviewReport');
const { authenticateToken } = require('../middleware/auth');

// Get all reports
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reports = await InterviewReport.find()
      .sort({ date: -1 })
      .populate('interview');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single report
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await InterviewReport.findById(req.params.id)
      .populate('interview');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new report
router.post('/', authenticateToken, async (req, res) => {
  try {
    const report = new InterviewReport({
      ...req.body,
      interviewerName: req.user.name,
      interviewerEmail: req.user.email,
    });
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a report
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await InterviewReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Only allow the interviewer who created the report to update it
    if (report.interviewerEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }

    const updatedReport = await InterviewReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a report
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await InterviewReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Only allow the interviewer who created the report to delete it
    if (report.interviewerEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    await report.remove();
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reports by interviewer
router.get('/interviewer/:email', authenticateToken, async (req, res) => {
  try {
    const reports = await InterviewReport.find({ interviewerEmail: req.params.email })
      .sort({ date: -1 })
      .populate('interview');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reports by candidate
router.get('/candidate/:name', authenticateToken, async (req, res) => {
  try {
    const reports = await InterviewReport.find({ candidateName: req.params.name })
      .sort({ date: -1 })
      .populate('interview');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 