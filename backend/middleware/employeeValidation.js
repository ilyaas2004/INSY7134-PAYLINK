const { body, validationResult } = require('express-validator');

// Employee login validation rules
exports.validateEmployeeLogin = [
  body('employeeId')
    .trim()
    .notEmpty()
    .withMessage('Employee ID is required')
    .matches(/^EMP[0-9]{6}$/)
    .withMessage('Invalid employee ID format'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid login credentials',
        errors: errors.array()
      });
    }
    next();
  }
];

// Payment rejection validation
exports.validatePaymentRejection = [
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Rejection reason is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters')
    .matches(/^[a-zA-Z0-9\s.,!?'-]+$/)
    .withMessage('Reason contains invalid characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  }
];

// Submit to SWIFT validation
exports.validateSwiftSubmission = [
  body('paymentIds')
    .isArray({ min: 1 })
    .withMessage('At least one payment ID is required'),
  
  body('paymentIds.*')
    .isMongoId()
    .withMessage('Invalid payment ID format'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  }
];