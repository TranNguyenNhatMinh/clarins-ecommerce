/**
 * Middleware phân quyền admin - chỉ admin mới được truy cập
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  next();
};
