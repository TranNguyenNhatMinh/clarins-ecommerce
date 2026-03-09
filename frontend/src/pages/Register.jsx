import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/shared/Toast';
import { ROUTES } from '../constants/index.js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: 'success' });
    try {
      await register(name, email, password, phone);
      setMessage({ text: 'Registration successful!', type: 'success' });
      setTimeout(() => navigate(ROUTES.home), 500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Registration failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <div className="px-4 py-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-1">Home / Sign up</p>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Create an account</h1>
          <p className="text-sm text-gray-600">
            Sign up with your details to enjoy a personalized experience.
          </p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm px-7 py-5 w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
                placeholder="+84 912 345 678"
                required
              />
            </div>
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
              <label className="block text-sm font-medium text-gray-800 mb-1">Password (min. 6 characters)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
                minLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-brand text-white text-sm font-semibold tracking-[0.18em] uppercase hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? 'Signing up…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to={ROUTES.login} className="text-brand hover:underline font-medium">
            Log in
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
