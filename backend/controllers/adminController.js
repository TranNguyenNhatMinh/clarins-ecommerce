/**
 * Admin controller - quản lý user (danh sách, xóa)
 */
import User from '../models/User.js';

// GET /api/admin/users - danh sách toàn bộ user (admin)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/users/:id - xóa user (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Không thể xóa chính mình.' });
    }

    const user = await User.findByIdAndDelete(targetId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    res.json({ success: true, message: 'Đã xóa người dùng.' });
  } catch (err) {
    next(err);
  }
};
