/**
 * Middleware xác thực JWT - bảo vệ route cần đăng nhập
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not logged in. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
