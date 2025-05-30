const Interview = require('../models/Interview');
const User = require('../models/User');

// Submit evaluation for an interview
exports.submitEvaluation = async (req, res) => {
  try {
    const { evaluation } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Check if user is authorized to submit evaluation
    if (interview.interviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update interview with evaluation data
    interview.evaluation = evaluation;
    interview.status = 'completed';
    await interview.save();

    res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get evaluation for a specific interview
exports.getEvaluation = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Check if user is authorized to view evaluation
    if (
      interview.company.toString() !== req.user._id.toString() &&
      interview.interviewer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if evaluation exists
    if (!interview.evaluation || Object.keys(interview.evaluation).length === 0) {
      return res.status(404).json({ message: 'Evaluation not found for this interview' });
    }

    res.json(interview.evaluation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate report based on evaluation data
exports.generateReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('company', 'companyName')
      .populate('interviewer', 'name');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Check if user is authorized to generate report
    if (
      interview.company.toString() !== req.user._id.toString() &&
      interview.interviewer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if evaluation exists
    if (!interview.evaluation || Object.keys(interview.evaluation).length === 0) {
      return res.status(404).json({ message: 'Evaluation not found for this interview' });
    }

    // Generate report object
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
};

// Update interviewer's rating based on company feedback
exports.rateInterviewer = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Check if user is authorized to rate the interviewer
    if (interview.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update interviewer rating
    const interviewer = await User.findById(interview.interviewer);
    
    if (!interviewer) {
      return res.status(404).json({ message: 'Interviewer not found' });
    }

    // Calculate new rating
    const newRating = interviewer.rating 
      ? (interviewer.rating + rating) / 2 
      : rating;
    
    interviewer.rating = parseFloat(newRating.toFixed(1));
    await interviewer.save();

    // Add rating to interview
    interview.interviewerRating = {
      score: rating,
      feedback: feedback
    };
    await interview.save();

    res.json({ 
      message: 'Interviewer rated successfully',
      newRating: interviewer.rating
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 