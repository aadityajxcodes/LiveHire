const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Company is required']
  },
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Interviewer is required']
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required']
  },
  requiredSkills: {
    type: [String],
    required: [true, 'Required skills are required']
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  roomId: {
    type: String,
    default: () => Math.random().toString(36).substring(2, 15)
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  }
}, { timestamps: true });

// Calculate overall score before saving
InterviewSchema.pre('save', function(next) {
  if (this.evaluation && this.evaluation.technicalSkills) {
    const technicalAvg = (
      this.evaluation.technicalSkills.algorithmicThinking +
      this.evaluation.technicalSkills.problemSolving +
      this.evaluation.technicalSkills.codeQuality +
      this.evaluation.technicalSkills.debugging +
      this.evaluation.technicalSkills.systemDesign +
      this.evaluation.technicalSkills.dataStructures
    ) / 6;

    const softSkillsAvg = (
      this.evaluation.softSkills.communication +
      this.evaluation.softSkills.problemApproach +
      this.evaluation.softSkills.teamworkPotential
    ) / 3;

    const codingTestAvg = (
      this.evaluation.codingTest.timeComplexity +
      this.evaluation.codingTest.spaceComplexity +
      this.evaluation.codingTest.edgeCases
    ) / 3;

    this.evaluation.overallScore = parseFloat(
      ((technicalAvg * 0.5) + (softSkillsAvg * 0.3) + (codingTestAvg * 0.2)).toFixed(1)
    );
  }
  next();
});

module.exports = mongoose.model('Interview', InterviewSchema); 