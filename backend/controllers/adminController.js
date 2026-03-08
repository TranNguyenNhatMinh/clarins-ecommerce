/**
 * Admin controller - quản lý user, newsletter subscribers
 */
import User from '../models/User.js';
import Subscriber from '../models/Subscriber.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

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
      return res.status(400).json({ success: false, message: 'You cannot delete yourself.' });
    }

    const user = await User.findByIdAndDelete(targetId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/subscribers - danh sách subscriber (search, sort, pagination)
export const getSubscribers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
    const search = (req.query.search || '').trim();
    const sortOrder = req.query.sort === 'oldest' ? 1 : -1;
    const sortField = { subscribedAt: sortOrder };

    const filter = {};
    if (search) {
      filter.email = { $regex: search, $options: 'i' };
    }

    const [list, total] = await Promise.all([
      Subscriber.find(filter).sort(sortField).skip((page - 1) * limit).limit(limit).lean(),
      Subscriber.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: list,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/subscribers/:id - xóa subscriber (admin)
export const deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found.' });
    }
    res.json({ success: true, message: 'Subscriber removed.' });
  } catch (err) {
    next(err);
  }
};
