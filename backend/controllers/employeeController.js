const Employee = require('../models/Employee');
const Payment = require('../models/Payment');
const jwt = require('jsonwebtoken');
const { recordFailedAttempt, resetAttempts } = require('../middleware/security');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, type: 'employee' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h',
  });
};

// @desc    Login employee
// @route   POST /api/employee/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { employeeId, email, password } = req.body;

    const employee = await Employee.findOne({ 
      employeeId, 
      email,
      isActive: true
    }).select('+password');

    if (!employee) {
      recordFailedAttempt(employeeId);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordMatch = await employee.comparePassword(password);

    if (!isPasswordMatch) {
      recordFailedAttempt(employeeId);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    resetAttempts(employeeId);

    const token = generateToken(employee._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      employee: {
        id: employee._id,
        fullName: employee.fullName,
        employeeId: employee.employeeId,
        email: employee.email,
        role: employee.role,
        department: employee.department
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Get current employee
// @route   GET /api/employee/me
// @access  Private (Employee)
exports.getMe = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id);

    res.status(200).json({
      success: true,
      employee: {
        id: employee._id,
        fullName: employee.fullName,
        employeeId: employee.employeeId,
        email: employee.email,
        role: employee.role,
        department: employee.department
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all pending payments
// @route   GET /api/employee/payments/pending
// @access  Private (Employee)
exports.getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'pending' })
      .populate('userId', 'fullName accountNumber')
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

// @desc    Get all payments (with status filter)
// @route   GET /api/employee/payments
// @access  Private (Employee)
exports.getAllPayments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const payments = await Payment.find(filter)
      .populate('userId', 'fullName accountNumber')
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

// @desc    Verify payment
// @route   PUT /api/employee/payments/:id/verify
// @access  Private (Employee)
exports.verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment has already been processed',
      });
    }

    payment.status = 'verified';
    payment.verifiedBy = req.employee.id;
    payment.verifiedAt = Date.now();
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error verifying payment',
    });
  }
};

// @desc    Reject payment
// @route   PUT /api/employee/payments/:id/reject
// @access  Private (Employee)
exports.rejectPayment = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment has already been processed',
      });
    }

    payment.status = 'rejected';
    payment.rejectionReason = reason;
    payment.verifiedBy = req.employee.id;
    payment.verifiedAt = Date.now();
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment rejected successfully',
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error rejecting payment',
    });
  }
};

// @desc    Submit verified payments to SWIFT
// @route   POST /api/employee/payments/submit-to-swift
// @access  Private (Employee)
exports.submitToSwift = async (req, res) => {
  try {
    const { paymentIds } = req.body;

    if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment IDs are required',
      });
    }

    const payments = await Payment.find({
      _id: { $in: paymentIds },
      status: 'verified'
    });

    if (payments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No verified payments found',
      });
    }

    // Update all payments to completed status
    await Payment.updateMany(
      { _id: { $in: paymentIds }, status: 'verified' },
      { 
        status: 'completed',
        submittedBy: req.employee.id,
        submittedAt: Date.now()
      }
    );

    res.status(200).json({
      success: true,
      message: `${payments.length} payment(s) submitted to SWIFT successfully`,
      count: payments.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting payments to SWIFT',
    });
  }
};

// @desc    Get payment statistics
// @route   GET /api/employee/statistics
// @access  Private (Employee)
exports.getStatistics = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const verifiedPayments = await Payment.countDocuments({ status: 'verified' });
    const completedPayments = await Payment.countDocuments({ status: 'completed' });
    const rejectedPayments = await Payment.countDocuments({ status: 'rejected' });

    res.status(200).json({
      success: true,
      statistics: {
        total: totalPayments,
        pending: pendingPayments,
        verified: verifiedPayments,
        completed: completedPayments,
        rejected: rejectedPayments
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
    });
  }
};