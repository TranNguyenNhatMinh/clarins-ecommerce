import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/index.js';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.home);
  };

  const navClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-primary-600">Admin Panel</h2>
          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
        </div>
        <nav className="p-2 flex-1">
          <NavLink to={ROUTES.admin.dashboard} className={navClass}>Dashboard</NavLink>
          <NavLink to={ROUTES.admin.products} className={navClass}>Product management</NavLink>
          <NavLink to={ROUTES.admin.users} className={navClass}>User management</NavLink>
          <NavLink to={ROUTES.admin.subscribers} className={navClass}>Newsletter / Subscribers</NavLink>
        </nav>
        <div className="p-2 border-t">
          <Link to={ROUTES.home} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">Back to home</Link>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-gray-100">Log out</button>
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Quản trị</h1>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
