import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';



/**
 * Middleware to verify JWT token and attach user ID to request
 */
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Missing or malformed token');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not defined in environment');
    return res.status(500).json({ message: 'Server misconfiguration: missing JWT secret' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn(`❌ Token valid but user not found: ${decoded.id}`);
      return res.status(401).json({ message: 'User not found' });
    }

    req.userId = decoded.id;
    console.log(`✅ Authenticated user: ${decoded.id}`);
    next();
  } catch (err) {
    console.error(`❌ Token verification failed: ${err.message}`);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
