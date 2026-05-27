import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
            BlogSphere
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/posts/new"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  <Edit size={18} />
                  <span className="hidden sm:inline">Write</span>
                </Link>
                <Link to="/profile" className="p-2 text-slate-600 hover:text-primary-600 transition-colors">
                  <UserIcon size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={24} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
