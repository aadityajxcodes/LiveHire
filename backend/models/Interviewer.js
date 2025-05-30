const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const InterviewerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  bio: {
    type: String,
    required: true,
  },
  skills: [{
    type: String,
    required: true,
  }],
  expertise: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  totalInterviews: {
    type: Number,
    default: 0,
  },
  successRate: {
    type: Number,
    default: 0,
  },
  availability: {
    type: String,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
InterviewerSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create JWT token
InterviewerSchema.methods.createJWT = function() {
  return jwt.sign(
    { userId: this._id, userType: 'interviewer', name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

// Compare password for login
InterviewerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update the updatedAt field before saving
InterviewerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Interviewer', InterviewerSchema); 