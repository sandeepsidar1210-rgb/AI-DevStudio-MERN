import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4">
        <Link
          to="/analyzer"
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
        >
          Go to Analyzer
        </Link>

        <Link to="/dashboard/analytics" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg">
          View Analytics
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;