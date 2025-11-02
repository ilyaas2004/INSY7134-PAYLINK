const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

exports.protectEmployee = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is for employee
    if (decoded.type !== 'employee') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Get employee from token
    req.employee = await Employee.findById(decoded.id).select('-password');

    if (!req.employee) {
      return res.status(401).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if employee is active
    if (!req.employee.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Employee account is inactive',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};

// Middleware to check if employee has admin role
exports.authorizeAdmin = (req, res, next) => {
  if (req.employee.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized. Admin access required.',
    });
  }
  next();
};