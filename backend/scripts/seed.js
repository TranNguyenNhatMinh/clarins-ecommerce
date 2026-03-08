/**
 * Script seed - tạo admin và sản phẩm mẫu (chạy: node scripts/seed.js)
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

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
    console.log('✓ Đã tạo admin: admin@example.com / admin123');
  } else {
    console.log('Admin đã tồn tại.');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Laptop Dell XPS 15', description: 'Laptop cao cấp, màn hình 15 inch', price: 25000000, category: 'Điện tử', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400' },
      { name: 'iPhone 15 Pro', description: 'Smartphone Apple flagship', price: 29900000, category: 'Điện thoại', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400' },
      { name: 'Tai nghe Sony WH-1000XM5', description: 'Tai nghe chống ồn', price: 6990000, category: 'Phụ kiện', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    ]);
    console.log('✓ Đã tạo 3 sản phẩm mẫu.');
  }
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
