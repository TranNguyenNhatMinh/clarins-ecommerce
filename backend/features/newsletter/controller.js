/**
 * Newsletter - đăng ký nhận tin (public)
 */
import Subscriber from '../../models/Subscriber.js';

const EMAIL_EXISTS_MESSAGE = 'Email này đã được đăng ký';

export const subscribe = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email.' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: EMAIL_EXISTS_MESSAGE });
    }

    await Subscriber.create({ email });
    res.status(201).json({
      success: true,
      message: 'Đăng ký nhận tin thành công.',
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: EMAIL_EXISTS_MESSAGE });
    }
    next(err);
  }
};
