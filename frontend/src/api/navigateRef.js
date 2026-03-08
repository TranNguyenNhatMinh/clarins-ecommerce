/**
 * Refs cho axios interceptor 401: logout (xóa token + user context) và navigate SPA.
 * AuthProvider gán authRef.current, App gán navigateRef.current.
 */
export const navigateRef = { current: null };
export const authRef = { current: null };
