const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Return user without password
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.patch('/me', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    
    // Prevent role change
    if (updates.role) {
      delete updates.role;
    }
    
    // Prevent password update through this route
    if (updates.password) {
      delete updates.password;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get interviewers with specific skills (for companies to search)
router.get('/interviewers', authenticateToken, async (req, res) => {
  try {
    // Check if user is a company
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can search for interviewers' });
    }
    
    const { skills } = req.query;
    let query = { role: 'interviewer' };
    
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills = { $in: skillsArray };
    }
    
    const interviewers = await User.find(query)
      .select('-password')
      .sort({ rating: -1 });
    
    res.json(interviewers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific interviewer's public profile
router.get('/interviewers/:id', authenticateToken, async (req, res) => {
  try {
    const interviewer = await User.findOne({
      _id: req.params.id,
      role: 'interviewer'
    }).select('-password -email');
    
    if (!interviewer) {
      return res.status(404).json({ message: 'Interviewer not found' });
    }
    
    res.json(interviewer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update interviewer availability
router.patch('/availability', authenticateToken, async (req, res) => {
  try {
    // Check if user is an interviewer
    if (req.user.role !== 'interviewer') {
      return res.status(403).json({ message: 'Only interviewers can update availability' });
    }
    
    const { availability } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { availability } },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 