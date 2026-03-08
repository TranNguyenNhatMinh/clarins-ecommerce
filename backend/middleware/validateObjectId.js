/**
 * Middleware kiểm tra req.params.id là ObjectId hợp lệ
 * Trả 400 nếu không hợp lệ để tránh 500 từ Mongoose
 */
import mongoose from 'mongoose';
import { error } from '../utils/response.js';

export const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return error(res, 'ID không hợp lệ.', 400);
  }
  next();
};
