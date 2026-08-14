import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7'];

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [languageData, setLanguageData] = useState([]);
  const [threatData, setThreatData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Filters ---
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [language, setLanguage] = useState('');
  const [availableLanguages, setAvailableLanguages] = useState([]);

  const buildParams = () => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (language) params.language = language;
    return params;
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = buildParams();
      const [summaryRes, langRes, threatRes, trendRes] = await Promise.all([
        api.get('/analytics/summary', { params }),
        api.get('/analytics/language-distribution', { params }),
        api.get('/analytics/threat-levels', { params }),
        api.get('/analytics/trend', { params }),
      ]);
      setSummary(summaryRes.data);
      setThreatData(threatRes.data);
      setTrendData(trendRes.data);
      setLanguageData(langRes.data);

      // Language filter dropdown ke liye options sirf pehli baar (unfiltered) se collect karo
      if (!language && availableLanguages.length === 0) {
        setAvailableLanguages(langRes.data.map((d) => d.language));
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    fetchAll();
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setLanguage('');
    setTimeout(fetchAll, 0); // state update ke baad fetch
  };

  const threatColor = {
    Low: 'bg-green-500/20 text-green-400 border-green-500/40',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    Critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  };

  if (loading && !summary) {
    return <div className="min-h-screen bg-slate-900 text-white p-8">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Filters bar */}
      <div className="bg-slate-800 p-4 rounded-lg mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-700 text-white p-2 rounded-lg outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-700 text-white p-2 rounded-lg outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-700 text-white p-2 rounded-lg outline-none text-sm min-w-[140px]"
          >
            <option value="">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleApplyFilters}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium"
        >
          Apply
        </button>
        <button
          onClick={handleClearFilters}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium"
        >
          Clear
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-xs mb-1">Total Scans</p>
          <p className="text-2xl font-bold">{summary?.totalScans ?? 0}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-xs mb-1">Avg Complexity</p>
          <p className="text-2xl font-bold">{summary?.avgComplexity?.toFixed(1) ?? 0}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-xs mb-1">Threats Found</p>
          <p className="text-2xl font-bold text-red-400">{summary?.threatsFound ?? 0}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-xs mb-1">Tokens Used</p>
          <p className="text-2xl font-bold">{summary?.totalTokens ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="font-semibold mb-4">Language Distribution</h2>
          {languageData.length === 0 ? (
            <p className="text-slate-500 text-sm">No data yet — run some analyses.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={languageData} dataKey="count" nameKey="language" outerRadius={90} label>
                  {languageData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="font-semibold mb-4">Threat Levels</h2>
          {threatData.length === 0 ? (
            <p className="text-slate-500 text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={threatData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="level" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="font-semibold mb-4">Complexity & Token Trend</h2>
        {trendData.length === 0 ? (
          <p className="text-slate-500 text-sm">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="avgComplexity" stroke="#6366f1" name="Avg Complexity" />
              <Line type="monotone" dataKey="totalTokens" stroke="#22c55e" name="Tokens Used" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;