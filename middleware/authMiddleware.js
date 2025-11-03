// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ NO TOKEN');
    return res.status(401).json({ message: 'No token' });
  }

  const token = authHeader.split(' ')[1];
  console.log('TOKEN:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('DECODED:', decoded); // SEE { id: '69085...' }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { id: user._id, email: user.email }; // LIGHTWEIGHT
    console.log(`✅ USER: ${user.email}`);
    next();
  } catch (err) {
    console.error('TOKEN DEAD:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};