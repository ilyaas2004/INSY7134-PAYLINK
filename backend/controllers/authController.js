const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, username, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ username }, { accountNumber }, { idNumber }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this username, account number, or ID number',
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      idNumber,
      accountNumber,
      username,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        accountNumber: user.accountNumber,
      },
    });
  } catch (error) {
  console.error(error);
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered',
      fields: error.keyValue
    });
  }
  res.status(500).json({
    success: false,
    message: 'Server error during registration',
  });
}

};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, accountNumber, password } = req.body;

    // Find user by username and account number
    const user = await User.findOne({ 
      username, 
      accountNumber 
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        accountNumber: user.accountNumber,
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

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        accountNumber: user.accountNumber,
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