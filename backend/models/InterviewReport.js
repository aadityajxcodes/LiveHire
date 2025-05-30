const mongoose = require('mongoose');

const interviewReportSchema = new mongoose.Schema({
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
  },
  candidateName: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  interviewerName: {
    type: String,
    required: true,
  },
  interviewerEmail: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled'],
    default: 'pending',
  },
  technicalSkills: {
    problemSolving: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    coding: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    systemDesign: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  softSkills: {
    communication: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    teamwork: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    problemSolving: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  summary: {
    type: String,
    required: true,
  },
  recommendation: {
    type: String,
    required: true,
  },
  strengths: [{
    type: String,
  }],
  areasForImprovement: [{
    type: String,
  }],
  codeSamples: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
interviewReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate overall rating before saving
interviewReportSchema.pre('save', function(next) {
  const techAvg = (this.technicalSkills.problemSolving + 
                  this.technicalSkills.coding + 
                  this.technicalSkills.systemDesign) / 3;
  
  const softAvg = (this.softSkills.communication + 
                  this.softSkills.teamwork + 
                  this.softSkills.problemSolving) / 3;
  
  this.overallRating = (techAvg + softAvg) / 2;
  next();
});

module.exports = mongoose.model('InterviewReport', interviewReportSchema); 