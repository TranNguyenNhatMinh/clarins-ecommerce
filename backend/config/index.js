/**
 * Config - tập trung biến môi trường
 * Load .env ngay khi load config để process.env đã có trước khi đọc
 */
import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
