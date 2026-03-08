/**
 * Entry point - Khởi chạy Express server và kết nối MongoDB
 * config/index.js đã gọi dotenv.config() khi load
 */
import mongoose from 'mongoose';
import app from './app.js';
import config from './config/index.js';

const { port, mongodbUri, jwt } = config;

if (!mongodbUri) {
  console.error('✗ Missing MONGODB_URI in .env');
  process.exit(1);
}
if (!jwt.secret) {
  console.error('✗ Missing JWT_SECRET in .env (set a secure value for production)');
  process.exit(1);
}

mongoose
  .connect(mongodbUri)
  .then(() => {
    console.log('✓ Connected to MongoDB');
    app.listen(port, () => {
      console.log(`✓ Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });
