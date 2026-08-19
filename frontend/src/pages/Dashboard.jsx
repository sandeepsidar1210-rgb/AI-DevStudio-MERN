import { useState, useEffect } from 'react';
import { Link , useLocation } from 'react-router-dom';
import { Code2, BarChart3, Crown, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Navbar from '../components/Navbar.jsx';
import api from '../services/api.js';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [upgrading, setUpgrading] = useState(false);
  const [freshUser, setFreshUser] = useState(null);

  useEffect(() => {
  const fetchMe = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setFreshUser(data);
    } catch (err) {
      console.error('Failed to fetch user info', err);
    }
  };
  fetchMe();

  window.addEventListener('focus', fetchMe);
  return () => window.removeEventListener('focus', fetchMe);
}, [location.key]);

  const currentUser = freshUser || user;
  const isPaid = currentUser?.tier === 'paid';

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { data: order } = await api.post('/payment/create-order');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'AI-DevStudio',
        description: 'Upgrade to Paid Tier',
        order_id: order.id,
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert('Payment successful! You are now on the paid tier.');
            window.location.reload();
          } catch (err) {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: currentUser?.name,
          email: currentUser?.email,
        },
        theme: { color: '#4F46E5' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert('Could not start payment.');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-indigo-400 text-sm font-medium mb-2">Welcome back</p>
            <h1 className="text-4xl font-bold mb-3">Hey, {currentUser?.name} 👋</h1>
            <p className="text-slate-400 max-w-xl">
              Analyze your code for performance and security issues, review your content for SEO,
              and track everything on your analytics dashboard.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {isPaid ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 px-4 py-2 rounded-lg text-sm font-medium">
                <Crown size={16} />
                Paid Plan — Unlimited
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm">
                  <Zap size={16} className="text-indigo-400" />
                  Free Plan — {currentUser?.analysesUsedToday ?? 0}/3 used today
                </div>
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 disabled:opacity-50 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap"
                >
                  <Crown size={16} />
                  {upgrading ? 'Loading...' : 'Upgrade to Paid'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

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