const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authRateLimiter, bruteForceProtection } = require('../middleware/security');

router.post('/register', validateRegistration, register);
router.post(
  '/login',
  authRateLimiter,           // IP-based rate limiting (5 attempts per 15 min)
  bruteForceProtection,      // Username-based brute force protection (3 attempts)
  validateLogin,
  login
);
router.get('/me', protect, getMe);

module.exports = router;