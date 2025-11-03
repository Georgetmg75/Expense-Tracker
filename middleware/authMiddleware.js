// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

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
    console.log('DECODED:', decoded); // { id: '69085...' }

    // SKIP DB QUERY — TRUST TOKEN (DB CONNECTED AT STARTUP)
    req.user = { 
      _id: decoded.id, 
      id: decoded.id 
    };
    console.log(`✅ AUTH SUCCESS: userId ${decoded.id}`);
    next();
  } catch (err) {
    console.error('TOKEN DEAD:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};