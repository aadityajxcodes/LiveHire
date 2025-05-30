const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Authentication token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired'
      });
    }
    res.status(401).json({
      message: 'Invalid token'
    });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
}; 