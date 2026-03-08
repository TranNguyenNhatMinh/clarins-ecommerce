/**
 * Script seed - tạo admin và sản phẩm mẫu (chạy: node scripts/seed.js hoặc npm run seed)
 */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const existingAdmin = await User.findOne({ email: 'admin@example.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✓ Created admin: admin@example.com / admin123');
  } else {
    console.log('Admin already exists.');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Face Serum', description: 'Premium face serum', price: 250000, category: 'face', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400' },
      { name: 'Lipstick Set', description: 'Matte lipstick collection', price: 299000, category: 'makeup', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400' },
      { name: 'Body Lotion', description: 'Hydrating body lotion', price: 199000, category: 'body', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    ]);
    console.log('✓ Created 3 sample products.');
  }
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
