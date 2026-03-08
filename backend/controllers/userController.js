/**
 * User controller - profile (xem, cập nhật)
 */
import User from '../models/User.js';

// GET /api/users/profile - xem thông tin cá nhân
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/profile - cập nhật thông tin (name, không đổi email/password ở đây)
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name || req.user.name },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'Profile updated successfully.', data: user });
  } catch (err) {
    next(err);
  }
};
