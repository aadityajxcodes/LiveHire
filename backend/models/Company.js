const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: [{
    type: String,
  }],
  logo: {
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

// Update the updatedAt field before saving
companySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
companySchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create JWT token
companySchema.methods.createJWT = function() {
  return jwt.sign(
    { userId: this._id, userType: 'company', name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

// Compare password for login
companySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Company', companySchema); 