const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authRateLimiter } = require('../middleware/security');

router.post('/register', validateRegistration, register);
router.post(
  '/login',
  authRateLimiter,
  validateLogin,
  login
);
router.get('/me', protect, getMe);

module.exports = router;