const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
//const ExpressBrute = require('express-brute');

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
  xFrameOptions: { action: 'deny' }, // Prevent clickjacking
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate limiting configuration
exports.generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for authentication endpoints
exports.authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again after 15 minutes.',
  skipSuccessfulRequests: true,
});

// Express Brute for brute force protection
/*const store = new ExpressBrute.MemoryStore();
exports.bruteforce = new ExpressBrute(store, {
  freeRetries: 3,
  minWait: 5 * 60 * 1000, // 5 minutes
  maxWait: 60 * 60 * 1000, // 1 hour
  failCallback: function (req, res, next, nextValidRequestDate) {
    res.status(429).json({
      success: false,
      message: `Too many failed attempts. Try again after ${nextValidRequestDate}`,
    });
  },
})*/