/**
 * Middleware xử lý lỗi tập trung - không để lộ stack trace trong production
 */
import { error as errResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  // Mongoose CastError (invalid ObjectId) → 400, message chung
  if (err.name === 'CastError') {
    return errResponse(res, 'ID không hợp lệ.', 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi máy chủ';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
