// controllers/authController.js
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';
import mongoose from 'mongoose'; // ← ADD THIS

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log('Incoming registration:', req.body);

    // FAIL-FAST: Check DB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('DB NOT CONNECTED. ReadyState:', mongoose.connection.readyState);
      return res.status(503).json({ message: 'Database unavailable. Please try again.' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log('User created:', user._id);

    // Generate token
    const token = generateToken(user._id);
    console.log('Token generated');

    // Success response
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error.message);
    console.error('STACK:', error.stack);
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message,
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  try {
    console.log('Incoming login:', req.body);

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    console.log('Token generated for login');

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching user:', req.user.id);

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('GETME ERROR:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});