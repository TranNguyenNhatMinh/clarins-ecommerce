/**
 * Entry point - Khởi chạy Express server và kết nối MongoDB
 * config/index.js đã gọi dotenv.config() khi load
 */
import mongoose from 'mongoose';
import app from './app.js';
import config from './config/index.js';

const { port, mongodbUri, jwt } = config;

if (!mongodbUri) {
  console.error('✗ Thiếu MONGODB_URI trong .env');
  process.exit(1);
}
if (!jwt.secret) {
  console.error('✗ Thiếu JWT_SECRET trong .env (cần đặt giá trị bảo mật khi chạy thật)');
  process.exit(1);
}

mongoose
  .connect(mongodbUri)
  .then(() => {
    console.log('✓ Đã kết nối MongoDB');
    app.listen(port, () => {
      console.log(`✓ Server chạy tại http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('✗ Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });
