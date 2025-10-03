const Payment = require('../models/Payment');

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res) => {
  try {
    const { amount, currency, provider, payeeAccount, swiftCode } = req.body;

    const payment = await Payment.create({
      userId: req.user.id,
      amount,
      currency,
      provider,
      payeeAccount,
      swiftCode,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment creation',
    });
  }
};

// @desc    Get user payments
// @route   GET /api/payments
// @access  Private
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching payments',
    });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Check if payment belongs to user
    if (payment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this payment',
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching payment',
    });
  }
};