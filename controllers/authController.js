// controllers/authController.js
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  console.log('Incoming registration:', req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Password hashed');

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  console.log('User created:', user._id);

  const token = generateToken(user._id);
  console.log('Token generated');

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  console.log('Incoming login:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  console.log('Token generated');

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  console.log('Fetching user:', req.user.id);

  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
  });
});