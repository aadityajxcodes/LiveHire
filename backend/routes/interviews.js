const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Interview = require('../models/Interview');
const User = require('../models/User');
const {
  findMatchingInterviewers,
  requestInterview,
  updateInterviewStatus,
} = require('../controllers/interviewController');

// Get scheduled interviews
router.get('/scheduled', authenticateToken, async (req, res) => {
  try {
    const interviews = await Interview.find({
      $or: [
        { company: req.user.userId },
        { interviewer: req.user.userId }
      ],
      status: { $in: ['pending', 'accepted'] },
      'schedule.date': { $gte: new Date() }
    })
    .populate('company', 'companyName')
    .populate('interviewer', 'name email rating')
    .sort({ 'schedule.date': 1 });
    
    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get completed interviews with evaluations
router.get('/completed', authenticateToken, async (req, res) => {
  try {
    const interviews = await Interview.find({
      $or: [
        { company: req.user.userId },
        { interviewer: req.user.userId }
      ],
      status: 'completed',
      'evaluation.overallScore': { $exists: true }
    })
    .populate('company', 'companyName')
    .populate('interviewer', 'name email rating')
    .sort({ 'schedule.date': -1 });

    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Schedule new interview
router.post('/schedule', authenticateToken, async (req, res) => {
  try {
    const { interviewerId, candidate, jobDetails, schedule, codingTest } = req.body;

    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can schedule interviews' });
    }

    const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const interview = new Interview({
      company: req.user.userId,
      interviewer: interviewerId,
      candidate,
      jobDetails,
      schedule,
      codingTest,
      roomId
    });

    const savedInterview = await interview.save();
    res.status(201).json(savedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all interviews for a user
router.get('/my-interviews', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'company'
      ? Interview.find({ company: req.user.userId }).populate('interviewer', 'name skills rating')
      : Interview.find({ interviewer: req.user.userId }).populate('company', 'companyName domain');

    const interviews = await query;
    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific interview by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('company', 'companyName domain industry')
      .populate('interviewer', 'name skills rating');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (
      interview.company._id.toString() !== req.user.userId.toString() &&
      interview.interviewer._id.toString() !== req.user.userId.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update interview status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.interviewer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    interview.status = status;
    const updatedInterview = await interview.save();
    res.json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit interview evaluation
router.patch('/:id/evaluate', authenticateToken, async (req, res) => {
  try {
    const { evaluation } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.interviewer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    interview.evaluation = evaluation;
    interview.status = 'completed';
    const updatedInterview = await interview.save();
    res.json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get evaluation for a specific interview
router.get('/:id/evaluation', authenticateToken, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (
      interview.company.toString() !== req.user.userId.toString() &&
      interview.interviewer.toString() !== req.user.userId.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!interview.evaluation || Object.keys(interview.evaluation).length === 0) {
      return res.status(404).json({ message: 'Evaluation not found for this interview' });
    }

    res.json(interview.evaluation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate report based on evaluation data
router.get('/:id/report', authenticateToken, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('company', 'companyName')
      .populate('interviewer', 'name');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (
      interview.company.toString() !== req.user.userId.toString() &&
      interview.interviewer.toString() !== req.user.userId.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!interview.evaluation || Object.keys(interview.evaluation).length === 0) {
      return res.status(404).json({ message: 'Evaluation not found for this interview' });
    }

    const report = {
      interviewId: interview._id,
      candidate: interview.candidate,
      company: interview.company,
      interviewer: interview.interviewer,
      jobDetails: interview.jobDetails,
      date: interview.schedule.date,
      scores: {
        technical: interview.evaluation.technicalScore,
        communication: interview.evaluation.communicationScore,
        coding: interview.evaluation.codingScore,
        overall: Math.round(
          (interview.evaluation.technicalScore +
            interview.evaluation.communicationScore +
            interview.evaluation.codingScore) / 3
        )
      },
      feedback: interview.evaluation.feedback,
      recommendation: interview.evaluation.finalDecision,
      generatedAt: new Date()
    };

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate interviewer
router.post('/:id/rate-interviewer', authenticateToken, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.company.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const interviewer = await User.findById(interview.interviewer);
    if (!interviewer) {
      return res.status(404).json({ message: 'Interviewer not found' });
    }

    const newRating = interviewer.rating 
      ? (interviewer.rating + rating) / 2 
      : rating;
    
    interviewer.rating = parseFloat(newRating.toFixed(1));
    await interviewer.save();

    interview.interviewerRating = {
      score: rating,
      feedback: feedback
    };
    await interview.save();

    res.json({ 
      message: 'Interviewer rated successfully',
      newRating: parseFloat(((interview.rating || 0) + rating) / 2).toFixed(1)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update code in interview
router.patch('/:id/code', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.codingTest.code = code;
    const updatedInterview = await interview.save();
    res.json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected routes
router.use(authenticateToken);

// Find matching interviewers
router.post('/find-interviewers', findMatchingInterviewers);

// Request interview with an interviewer
router.post('/request', requestInterview);

// Update interview status (accept/reject)
router.patch('/:interviewId/status', updateInterviewStatus);

module.exports = router; 