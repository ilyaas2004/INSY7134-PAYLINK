const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount'],
    min: [0.01, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    required: [true, 'Please provide currency'],
    enum: ['USD', 'EUR', 'GBP', 'ZAR'],
    default: 'USD'
  },
  provider: {
    type: String,
    required: [true, 'Please provide payment provider'],
    enum: ['SWIFT'],
    default: 'SWIFT'
  },
  payeeAccount: {
    type: String,
    required: [true, 'Please provide payee account number'],
    trim: true,
    match: [/^[0-9A-Z]{8,34}$/, 'Please provide a valid account number']
  },
  swiftCode: {
    type: String,
    required: [true, 'Please provide SWIFT code'],
    trim: true,
    match: [/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Please provide a valid SWIFT code']
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'completed', 'rejected'],
    default: 'pending'
  },

  // ✅ Employee Portal fields
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  verifiedAt: {
    type: Date
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  submittedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
