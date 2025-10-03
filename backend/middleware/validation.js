const { body, validationResult } = require('express-validator');

// Registration validation rules
exports.validateRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
  
  body('idNumber')
    .trim()
    .matches(/^[0-9]{13}$/)
    .withMessage('ID number must be exactly 13 digits'),
  
  body('accountNumber')
    .trim()
    .matches(/^[0-9]{10,16}$/)
    .withMessage('Account number must be 10-16 digits'),
  
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  
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

// Login validation rules
exports.validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Invalid username format'),
  
  body('accountNumber')
    .trim()
    .matches(/^[0-9]{10,16}$/)
    .withMessage('Invalid account number format'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid login credentials' 
      });
    }
    next();
  }
];

// Payment validation rules
exports.validatePayment = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  
  body('currency')
    .trim()
    .isIn(['USD', 'EUR', 'GBP', 'ZAR'])
    .withMessage('Invalid currency'),
  
  body('provider')
    .trim()
    .equals('SWIFT')
    .withMessage('Only SWIFT provider is supported'),
  
  body('payeeAccount')
    .trim()
    .matches(/^[0-9A-Z]{8,34}$/)
    .withMessage('Invalid payee account format'),
  
  body('swiftCode')
    .trim()
    .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)
    .withMessage('Invalid SWIFT code format'),
  
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