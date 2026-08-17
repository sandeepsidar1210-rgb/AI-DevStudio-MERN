import { Link } from 'react-router-dom';
import { Code2, BarChart3, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Sparkles size={18} />
          </div>
          <span className="font-semibold">AI-DevStudio</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <p className="text-indigo-400 text-sm font-medium mb-2">Welcome back</p>
        <h1 className="text-4xl font-bold mb-3">
          Hey, {user?.name} <span className="inline-block">👋</span>
        </h1>
        <p className="text-slate-400 max-w-xl">
          Analyze your code for performance and security issues, review your content for SEO,
          and track everything on your analytics dashboard.
        </p>
      </div>

      {/* Action cards */}
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/analyzer"
          className="group relative overflow-hidden bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-2xl p-6 transition-all"
        >
          <div className="bg-indigo-600/20 text-indigo-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Code2 size={24} />
          </div>
          <h2 className="text-lg font-semibold mb-1">Analyzer</h2>
          <p className="text-slate-400 text-sm">
            Paste a code snippet or content draft and get instant AI-powered feedback.
          </p>
          <span className="inline-block mt-4 text-sm text-indigo-400 group-hover:translate-x-1 transition-transform">
            Start analyzing →
          </span>
        </Link>

        <Link
          to="/dashboard/analytics"
          className="group relative overflow-hidden bg-slate-800 border border-slate-700 hover:border-emerald-500 rounded-2xl p-6 transition-all"
        >
          <div className="bg-emerald-600/20 text-emerald-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 size={24} />
          </div>
          <h2 className="text-lg font-semibold mb-1">Analytics Dashboard</h2>
          <p className="text-slate-400 text-sm">
            View charts, KPIs, and trends across all your past analyses.
          </p>
          <span className="inline-block mt-4 text-sm text-emerald-400 group-hover:translate-x-1 transition-transform">
            View insights →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;