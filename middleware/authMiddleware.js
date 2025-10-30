import jwt from 'jsonwebtoken';
import debug from 'debug';
import User from '../models/userModel.js';

const log = debug('expense-tracker:auth');

/**
 * Middleware to verify JWT token and attach user ID to request
 */
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    log('❌ Missing or malformed token');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Ensure JWT secret is defined
  if (!process.env.JWT_SECRET) {
    log('❌ JWT_SECRET is not defined in environment');
    return res.status(500).json({ message: 'Server misconfiguration: missing JWT secret' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      log(`❌ Token valid but user not found: ${decoded.id}`);
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user ID to request
    req.userId = decoded.id;
    log(`✅ Authenticated user: ${decoded.id}`);
    next();
  } catch (err) {
    log(`❌ Token verification failed: ${err.message}`);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};






// import jwt from 'jsonwebtoken';
// import debug from 'debug';
// import User from '../models/userModel.js';

// const log = debug('expense-tracker:auth');

// export const verifyToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     log('❌ Missing or malformed token');
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   if (!process.env.JWT_SECRET) {
//     log('❌ JWT_SECRET is not defined in environment');
//     return res.status(500).json({ message: 'Server misconfiguration: missing JWT secret' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);
//     if (!user) {
//       log(`❌ Token valid but user not found: ${decoded.id}`);
//       return res.status(401).json({ message: 'User not found' });
//     }

//     req.userId = decoded.id;
//     log(`✅ Authenticated user: ${decoded.id}`);
//     next();
//   } catch (err) {
//     log(`❌ Token verification failed: ${err.message}`);
//     res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };
