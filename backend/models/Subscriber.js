/**
 * Newsletter subscriber - collection newsletter_subscribers
 * Lưu email đăng ký nhận tin, tránh trùng, có thời gian và trạng thái
 */
import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
    },
  },
  { versionKey: false, collection: 'newsletter_subscribers' }
);

export default mongoose.model('Subscriber', subscriberSchema);
