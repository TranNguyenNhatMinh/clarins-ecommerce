import { useState, useEffect } from 'react';
import { userService } from '../api/services/userService.js';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/shared/Toast';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  useEffect(() => {
    let cancelled = false;
    userService
      .getProfile()
      .then((u) => {
        if (!cancelled && u) {
          setProfile(u);
          setName(u.name || '');
          setPhone(u.phone || '');
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setFetchLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: 'success' });
    try {
      const payload = { name, phone: phone || undefined };
      const data = await userService.updateProfile(payload);
      const u = data.data;
      setProfile(u);
      updateUser(u ? { ...u, id: u._id ?? u.id } : u);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <LoadingSpinner className="min-h-[40vh]" />;

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-600">Profile information could not be loaded.</p>
        </div>
      </div>
    );
  }

  const createdAt = profile.createdAt ? new Date(profile.createdAt) : null;

  return (
    <div className="px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-7">
          <p className="text-xs text-gray-500 mb-1">Home / Profile</p>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Account details</h1>
          <p className="text-sm text-gray-600">
            View and update the information associated with your account.
          </p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm px-7 py-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-700 mb-5">
            <div>
              <span className="text-gray-500 block">Email</span>
              <span className="font-medium break-all">{profile.email}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Phone</span>
              <span className="font-medium">{profile.phone || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Role</span>
              <span className="font-medium capitalize">{profile.role}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Member since</span>
              <span className="font-medium">
                {createdAt ? createdAt.toLocaleDateString() : '—'}
              </span>
            </div>
          </div>

          <hr className="border-gray-200 mb-5" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
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
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
              <input
                type="email"
                value={profile.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-brand text-white text-sm font-semibold tracking-[0.18em] uppercase hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        <section className="mt-10 border-t border-gray-200 pt-6">
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
