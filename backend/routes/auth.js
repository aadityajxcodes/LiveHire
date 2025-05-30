const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, workDetails } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'company', // Default to company if no role specified
      workDetails
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Failed to get user information',
      error: error.message
    });
  }
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user
  });
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        message: 'Token is required'
      });
    }

    // Verify existing token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Generate new token
    const newToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Token refreshed successfully',
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      message: 'Invalid or expired token',
      error: error.message
    });
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just send a success response
  res.json({
    message: 'Logged out successfully'
  });
});

module.exports = router; 