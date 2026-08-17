import { Link, useLocation } from 'react-router-dom';
import { Sparkles, LogOut, Code2, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? 'bg-slate-800 text-white'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`;

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Sparkles size={18} />
          </div>
          <span className="font-semibold">AI-DevStudio</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/analyzer" className={linkClass('/analyzer')}>
            <Code2 size={16} />
            <span className="hidden sm:inline">Analyzer</span>
          </Link>
          <Link to="/dashboard/analytics" className={linkClass('/dashboard/analytics')}>
            <BarChart3 size={16} />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
          <div className="w-px h-6 bg-slate-700 mx-2" />
          <span className="text-sm text-slate-400 hidden md:inline">{user?.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;