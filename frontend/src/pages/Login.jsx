import { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: 'success' });
    try {
      await login(email, password);
      setMessage({ text: 'Login successful!', type: 'success' });
      setTimeout(() => {
        navigate(isAdmin ? ROUTES.admin.dashboard : ROUTES.home);
      }, 400);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Login failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <div className="px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-7">
          <p className="text-xs text-gray-500 mb-1">Home / Log in</p>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Sign in or create an account</h1>
          <p className="text-sm text-gray-600">
            Please enter your email address and password.
          </p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm px-7 py-6 w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
                required
              />
            </div>
            <div className="flex items-center text-xs text-gray-700">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 border-gray-300 text-brand focus:ring-brand mr-2"
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-brand text-white text-sm font-semibold tracking-[0.18em] uppercase hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account yet?{' '}
          <Link to={ROUTES.register} className="text-brand hover:underline font-medium">
            Create one now
          </Link>
          .
        </p>

        <section className="mt-6">
          <div className="flex items-center gap-5 text-sm text-gray-800">
            <div className="flex flex-col items-center text-[0.7rem] text-gray-800">
              <div className="w-12 h-12 border border-gray-800 rounded-full flex items-center justify-center text-sm font-semibold tracking-[0.18em]">
                B
              </div>
              <span className="mt-1 leading-tight text-[0.7rem] text-gray-700 text-center">
                Certified
                <br />
                Corporation
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-900">
                This company meets high standards of social and environmental impact.
              </p>
              <button type="button" className="mt-1 text-xs text-gray-500 hover:underline">
                Learn more
              </button>
            </div>
          </div>
        </section>

        {message.text && (
          <Toast
            message={message.text}
            type={message.type}
            onClose={() => setMessage({ text: '', type: 'success' })}
          />
        )}
      </div>
    </div>
  );
}
