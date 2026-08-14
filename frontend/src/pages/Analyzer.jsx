import { useState } from 'react';
import api from '../services/api.js';

const Analyzer = () => {
  const [type, setType] = useState('code');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/analysis', { type, inputText });
      setResult(data.result);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const threatColor = {
    Low: 'bg-green-500/20 text-green-400 border-green-500/40',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    Critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Analyzer</h1>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setType('code')}
          className={`px-4 py-2 rounded-lg ${type === 'code' ? 'bg-indigo-600' : 'bg-slate-700'}`}
        >
          Code
        </button>
        <button
          onClick={() => setType('content')}
          className={`px-4 py-2 rounded-lg ${type === 'content' ? 'bg-indigo-600' : 'bg-slate-700'}`}
        >
          Content
        </button>
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={type === 'code' ? 'Paste your code here...' : 'Paste your blog/content draft here...'}
        rows={10}
        className="w-full p-4 rounded-lg bg-slate-800 text-white outline-none font-mono text-sm mb-4"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-6 py-3 rounded-lg font-medium mb-6"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {result && (
        <div className="space-y-6">
          {/* Top summary row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {result.language && (
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Language</p>
                <p className="font-semibold">{result.language}</p>
              </div>
            )}
            {result.overallScore !== undefined && (
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Overall Score</p>
                <p className="font-semibold">{result.overallScore}/10</p>
              </div>
            )}
            {result.complexityScore !== undefined && (
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Complexity</p>
                <p className="font-semibold">{result.complexityScore}/10</p>
              </div>
            )}
            {result.threatLevel && (
              <div className={`p-4 rounded-lg border ${threatColor[result.threatLevel] || 'bg-slate-800'}`}>
                <p className="text-xs mb-1 opacity-80">Threat Level</p>
                <p className="font-semibold">{result.threatLevel}</p>
              </div>
            )}
            {result.readabilityScore !== undefined && (
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Readability</p>
                <p className="font-semibold">{result.readabilityScore}/10</p>
              </div>
            )}
          </div>

          {/* Security Vulnerabilities */}
          {result.securityVulnerabilities?.length > 0 && (
            <div className="bg-slate-800 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 text-red-400">🛡 Security Vulnerabilities</h2>
              <ul className="space-y-2">
                {result.securityVulnerabilities.map((item, i) => (
                  <li key={i} className="text-sm text-slate-300 pl-4 border-l-2 border-red-500/50">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Performance Issues */}
          {result.performanceIssues?.length > 0 && (
            <div className="bg-slate-800 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 text-yellow-400">⚡ Performance Issues</h2>
              <ul className="space-y-2">
                {result.performanceIssues.map((item, i) => (
                  <li key={i} className="text-sm text-slate-300 pl-4 border-l-2 border-yellow-500/50">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SEO Suggestions (content type) */}
          {result.seoSuggestions?.length > 0 && (
            <div className="bg-slate-800 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 text-blue-400">🔍 SEO Suggestions</h2>
              <ul className="space-y-2">
                {result.seoSuggestions.map((item, i) => (
                  <li key={i} className="text-sm text-slate-300 pl-4 border-l-2 border-blue-500/50">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* General Suggestions */}
          {result.suggestions?.length > 0 && (
            <div className="bg-slate-800 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 text-green-400">✅ Suggestions</h2>
              <ul className="space-y-2">
                {result.suggestions.map((item, i) => (
                  <li key={i} className="text-sm text-slate-300 pl-4 border-l-2 border-green-500/50">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analyzer;