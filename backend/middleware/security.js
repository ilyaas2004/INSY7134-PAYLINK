const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Helmet configuration for security headers
exports.helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  xFrameOptions: { action: 'deny' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate limiting configuration
exports.generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for authentication endpoints - BRUTE FORCE PROTECTION
exports.authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 attempts
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  skipSuccessfulRequests: true, // Don't count successful logins
  standardHeaders: true,
  legacyHeaders: false,
  // Custom handler for better error message
  handler: (req, res) => {
    const resetTime = new Date(Date.now() + 15 * 60 * 1000);
    res.status(429).json({
      success: false,
      message: 'Too many failed login attempts. For security, your IP address has been temporarily blocked.',
      reason: 'Brute force protection activated',
      tryAgainAfter: resetTime.toLocaleTimeString(),
      blockedFor: '15 minutes'
    });
  }
});

// Additional brute force protection - tracks by username
const loginAttempts = new Map();

exports.bruteForceProtection = (req, res, next) => {
  const identifier = req.body.username || req.ip;
  const now = Date.now();
  
  if (!loginAttempts.has(identifier)) {
    loginAttempts.set(identifier, { count: 0, firstAttempt: now });
  }
  
  const attempts = loginAttempts.get(identifier);
  
  // Reset if 15 minutes have passed
  if (now - attempts.firstAttempt > 15 * 60 * 1000) {
    loginAttempts.set(identifier, { count: 0, firstAttempt: now });
    return next();
  }
  
  // Check if exceeded attempts
  if (attempts.count >= 3) {
    const timeLeft = Math.ceil((15 * 60 * 1000 - (now - attempts.firstAttempt)) / 60000);
    return res.status(429).json({
      success: false,
      message: `Account temporarily locked due to multiple failed login attempts. Please try again in ${timeLeft} minutes.`,
      reason: 'Brute force protection - too many failed attempts for this account',
      attemptsRemaining: 0
    });
  }
  
  next();
};

// Call this after failed login
exports.recordFailedAttempt = (identifier) => {
  if (loginAttempts.has(identifier)) {
    const attempts = loginAttempts.get(identifier);
    attempts.count++;
  }
};

// Call this after successful login
exports.resetAttempts = (identifier) => {
  loginAttempts.delete(identifier);
};