import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import FairnessRing from '../components/FairnessRing';
import BiasChart from '../components/BiasChart';

const verdictConfig = {
  PASS: {
    bg: 'bg-green-600/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
    glow: 'shadow-green-500/10',
    label: 'PASS',
  },
  WARNING: {
    bg: 'bg-amber-600/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/10',
    label: 'WARNING',
  },
  FAIL: {
    bg: 'bg-red-600/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    glow: 'shadow-red-500/10',
    label: 'FAIL',
  },
};

export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

  // Keyboard shortcut: Escape goes back
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') navigate('/analyze');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  // Update page title
  useEffect(() => {
    document.title = 'Bias Report — FairAI Inspector';
    return () => { document.title = 'FairAI Inspector'; };
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No analysis data found.</p>
          <button
            onClick={() => navigate('/analyze')}
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            ← Go to Analyze
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#0a0a0f]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">⚖️</span>
            <span className="font-bold text-white">Fair<span className="text-indigo-400">AI</span></span>
          </button>
          <button
            onClick={() => navigate('/analyze')}
            className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1"
          >
            ← Analyze another file
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Bias Report</h1>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
            <span>📄 {analysis.datasetName}</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <span>{analysis.rowCount?.toLocaleString()} rows</span>
          </div>
        </motion.div>

        {/* Fairness Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center my-10"
        >
          <FairnessRing score={analysis.fairnessScore} size={200} />
        </motion.div>

        {/* Column Cards */}
        <div className="space-y-6">
          {Object.entries(analysis.columns).map(([colName, metrics], index) => {
            const verdict = verdictConfig[metrics.verdict] || verdictConfig.PASS;
            const explanation = analysis.explanations?.[colName];

            return (
              <motion.div
                key={colName}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                className="bg-[#12121a] border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all duration-300"
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-white capitalize">{colName.replace(/_/g, ' ')}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${verdict.bg} ${verdict.border} ${verdict.text} border ${
                      metrics.verdict === 'FAIL' ? 'animate-pulse-slow' : ''
                    }`}
                  >
                    {verdict.label}
                  </span>
                </div>

                {/* Chart */}
                <BiasChart groups={metrics.groups} columnName={colName} />

                {/* Metrics row */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a2e] rounded-lg">
                    <span className="text-gray-500 text-xs">DIR</span>
                    <span className={`text-sm font-mono font-semibold ${verdict.text}`}>
                      {metrics.dir.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a2e] rounded-lg">
                    <span className="text-gray-500 text-xs">SPD</span>
                    <span className="text-sm font-mono font-semibold text-gray-300">
                      {metrics.spd.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a2e] rounded-lg">
                    <span className="text-gray-500 text-xs">Majority</span>
                    <span className="text-sm text-gray-300">{metrics.majorityGroup}</span>
                    <span className="text-xs text-gray-500">({(metrics.majorityRate * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a2e] rounded-lg">
                    <span className="text-gray-500 text-xs">Minority</span>
                    <span className="text-sm text-gray-300">{metrics.minorityGroup}</span>
                    <span className="text-xs text-gray-500">({(metrics.minorityRate * 100).toFixed(1)}%)</span>
                  </div>
                </div>

                {/* DIR Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Disparate Impact Ratio</span>
                    <span>Threshold: 0.80</span>
                  </div>
                  <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden relative">
                    {/* Threshold marker */}
                    <div className="absolute left-[80%] top-0 w-px h-full bg-gray-600 z-10" />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(metrics.dir * 100, 100)}%` }}
                      transition={{ delay: 0.5 + index * 0.15, duration: 1 }}
                      className={`h-full rounded-full ${
                        metrics.verdict === 'PASS'
                          ? 'bg-green-500'
                          : metrics.verdict === 'WARNING'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>

                {/* AI Explanation */}
                {explanation && (
                  <div className="mt-5 p-4 bg-teal-600/5 border border-teal-500/15 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs">🤖</span>
                      <span className="text-teal-400 text-xs font-medium">AI Fairness Analysis</span>
                      <span className="ml-auto text-gray-600 text-[10px] flex items-center gap-1">
                        Powered by Gemini ✨
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{explanation}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-[#12121a]/50 border border-gray-800/30 rounded-xl"
        >
          <p className="text-gray-500 text-xs text-center">
            ⚠️ Results are indicative, not legal proof. The DIR threshold of 0.8 is based on the US EEOC "four-fifths rule."
            This tool detects correlation, not causation. Results should be reviewed by a qualified professional.
          </p>
        </motion.div>

        {/* Back button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/analyze')}
            className="text-indigo-400 hover:text-indigo-300 text-sm underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-500/60 transition-all"
          >
            ← Analyze another file
          </button>
          <p className="text-gray-600 text-xs mt-2">Press Escape to go back</p>
        </div>
      </main>
    </div>
  );
}
