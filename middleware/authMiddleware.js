import jwt from 'jsonwebtoken';
import debug from 'debug';
import User from '../models/userModel.js';

const log = debug('expense-tracker:auth');

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    log('❌ Missing or malformed token');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    log('❌ JWT_SECRET is not defined in environment');
    return res.status(500).json({ message: 'Server misconfiguration: missing JWT secret' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      log(`❌ Token valid but user not found: ${decoded.id}`);
      return res.status(401).json({ message: 'User not found' });
    }

    req.userId = decoded.id;
    log(`✅ Authenticated user: ${decoded.id}`);
    next();
  } catch (err) {
    log(`❌ Token verification failed: ${err.message}`);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
