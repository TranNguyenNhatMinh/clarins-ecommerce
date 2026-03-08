/**
 * Response helpers - format trả về thống nhất
 * { success: true|false, message?, data? }
 */

export function success(res, data = null, message = null, statusCode = 200) {
  const body = { success: true };
  if (message != null) body.message = message;
  if (data != null) body.data = data;
  return res.status(statusCode).json(body);
}

export function error(res, message = 'Lỗi máy chủ', statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}
