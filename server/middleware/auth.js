const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretcrowdsensekey123');

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token expired or invalid' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Middleware to restrict access by role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized, insufficient role access' });
    }
    next();
  };
};

module.exports = { protect, requireRole };
