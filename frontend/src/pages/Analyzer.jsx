import { useState } from 'react';
import { Code2, FileText, Loader2 } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Analyzer</h1>
        <p className="text-slate-400 text-sm mb-6">Paste code or content to get instant AI feedback</p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'code' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Code2 size={16} /> Code
          </button>
          <button
            onClick={() => setType('content')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'content' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={16} /> Content
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={type === 'code' ? 'Paste your code here...' : 'Paste your blog/content draft here...'}
          rows={10}
          className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-indigo-500 text-white outline-none font-mono text-sm mb-4 transition-colors"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-6 py-2.5 rounded-lg font-medium text-sm mb-8 transition-colors"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.language && (
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                  <p className="text-slate-400 text-xs mb-1">Language</p>
                  <p className="font-semibold">{result.language}</p>
                </div>
              )}
              {result.overallScore !== undefined && (
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                  <p className="text-slate-400 text-xs mb-1">Overall Score</p>
                  <p className="font-semibold">{result.overallScore}/10</p>
                </div>
              )}
              {result.complexityScore !== undefined && (
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                  <p className="text-slate-400 text-xs mb-1">Complexity</p>
                  <p className="font-semibold">{result.complexityScore}/10</p>
                </div>
              )}
              {result.threatLevel && (
                <div className={`p-4 rounded-xl border ${threatColor[result.threatLevel] || 'bg-slate-800'}`}>
                  <p className="text-xs mb-1 opacity-80">Threat Level</p>
                  <p className="font-semibold">{result.threatLevel}</p>
                </div>
              )}
              {result.readabilityScore !== undefined && (
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                  <p className="text-slate-400 text-xs mb-1">Readability</p>
                  <p className="font-semibold">{result.readabilityScore}/10</p>
                </div>
              )}
            </div>

            {result.securityVulnerabilities?.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-3 text-red-400">🛡 Security Vulnerabilities</h2>
                <ul className="space-y-2">
                  {result.securityVulnerabilities.map((item, i) => (
                    <li key={i} className="text-sm text-slate-300 pl-4 border-l-2 border-red-500/50">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.performanceIssues?.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-3 text-yellow-400">⚡ Performance Issues</h2>
                <ul className="space-y-2">
                  {result.performanceIssues.map((item, i) => (
                    <li key={i} className="text-sm text-slate-300 pl-4 border-l-2 border-yellow-500/50">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.seoSuggestions?.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-3 text-blue-400">🔍 SEO Suggestions</h2>
                <ul className="space-y-2">
                  {result.seoSuggestions.map((item, i) => (
                    <li key={i} className="text-sm text-slate-300 pl-4 border-l-2 border-blue-500/50">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-3 text-green-400">✅ Suggestions</h2>
                <ul className="space-y-2">
                  {result.suggestions.map((item, i) => (
                    <li key={i} className="text-sm text-slate-300 pl-4 border-l-2 border-green-500/50">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyzer;