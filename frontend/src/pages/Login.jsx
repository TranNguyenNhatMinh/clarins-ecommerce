import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/shared/Toast';
import { ROUTES } from '../constants/index.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect when already logged in (avoid navigate during render)
  useEffect(() => {
    if (!user) return;
    navigate(isAdmin ? ROUTES.admin.dashboard : ROUTES.home);
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: 'success' });
    try {
      await login(email, password);
      setMessage({ text: 'Login successful!', type: 'success' });
      setTimeout(() => {
        navigate(isAdmin ? ROUTES.admin.dashboard : ROUTES.home);
      }, 500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Login failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Log in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to={ROUTES.register} className="text-primary-600 hover:underline">Sign up</Link>
        </p>
      </div>
      {message.text && <Toast message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'success' })} />}
    </div>
  );
}
