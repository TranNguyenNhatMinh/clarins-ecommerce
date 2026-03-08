/**
 * Middleware xử lý lỗi tập trung - không để lộ stack trace trong production
 */
import { error as errResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  // Mongoose CastError (invalid ObjectId) → 400
  if (err.name === 'CastError') {
    return errResponse(res, 'Invalid ID.', 400);
  }

  // Mongoose ValidationError (schema/unique) → 400, message rõ ràng
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {})
      .map((e) => e?.message)
      .filter(Boolean)[0] || 'Invalid data.';
    return errResponse(res, message, 400);
  }

  // Mongo duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    return errResponse(res, `${field} is already in use.`, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
