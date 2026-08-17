import { useEffect, useState } from 'react';
import { Code2, FileText, Clock, ChevronDown } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const threatColor = {
  Low: 'bg-green-500/20 text-green-400 border-green-500/40',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  Critical: 'bg-red-500/20 text-red-400 border-red-500/40',
};

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/analysis');
        setAnalyses(data);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getTitle = (item) => {
    if (item.type === 'content') return 'Content analysis';
    const lang = item.language && item.language !== 'unknown' ? item.language : 'Code';
    return `${lang} analysis`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">History</h1>
        <p className="text-slate-400 text-sm mb-6">Your past code and content analyses</p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800 rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <p className="text-slate-400 text-sm">No analyses yet. Run one from the Analyzer page.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((item) => {
              const isOpen = expandedId === item._id;
              return (
                <div
                  key={item._id}
                  className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : item._id)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`shrink-0 p-2 rounded-lg ${item.type === 'code' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-blue-600/20 text-blue-400'}`}>
                        {item.type === 'code' ? <Code2 size={18} /> : <FileText size={18} />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{getTitle(item)}</p>
                        <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={12} />
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {item.threatLevel && (
                        <span className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${threatColor[item.threatLevel] || ''}`}>
                          {item.threatLevel}
                        </span>
                      )}
                      <ChevronDown
                        size={16}
                        className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-slate-700 pt-4">
                      <p className="text-xs text-slate-500 mb-2">Input</p>
                      <pre className="text-xs text-slate-300 bg-slate-900 rounded-lg p-3 mb-4 overflow-x-auto whitespace-pre-wrap">
                        {item.inputText.slice(0, 300)}{item.inputText.length > 300 ? '...' : ''}
                      </pre>

                      {item.result?.suggestions?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 mb-1.5">Top suggestions</p>
                          <ul className="space-y-1">
                            {item.result.suggestions.slice(0, 3).map((s, i) => (
                              <li key={i} className="text-sm text-slate-300 pl-3 border-l-2 border-green-500/50">{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-2 border-t border-slate-700/60">
                        {item.type === 'code' && item.complexityScore !== undefined && (
                          <span>Complexity: {item.complexityScore}/10</span>
                        )}
                        {item.type === 'content' && item.result?.readabilityScore !== undefined && (
                          <span>Readability: {item.result.readabilityScore}/10</span>
                        )}
                        {item.tokensUsed !== undefined && <span>Tokens: {item.tokensUsed}</span>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;