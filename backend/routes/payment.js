const express = require('express');
const router = express.Router();
const {
  createPayment,
  getUserPayments,
  getPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validation');

router.post('/', protect, validatePayment, createPayment);
router.get('/', protect, getUserPayments);
router.get('/:id', protect, getPayment);

module.exports = router;