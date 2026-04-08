import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { DEMO_ANALYSES, isDemoMode, clearDemoMode } from '../data/demoData';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const verdictConfig = {
  PASS: { bg: 'bg-green-600/10', text: 'text-green-400', border: 'border-green-500/20' },
  WARNING: { bg: 'bg-amber-600/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  FAIL: { bg: 'bg-red-600/10', text: 'text-red-400', border: 'border-red-500/20' },
};

function getScoreColor(score) {
  if (score < 60) return 'text-red-400';
  if (score < 80) return 'text-amber-400';
  return 'text-green-400';
}

function getScoreRingColor(score) {
  if (score < 60) return '#dc2626';
  if (score < 80) return '#d97706';
  return '#16a34a';
}

function MiniScoreRing({ score, size = 48 }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreRingColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1e1e2e" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${getScoreColor(score)}`}>
        {score}
      </span>
    </div>
  );
}

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const demo = isDemoMode();
  const analyses = demo ? DEMO_ANALYSES : [];

  const handleSignOut = async () => {
    try {
      clearDemoMode();
      await signOut(auth);
      toast.success('Signed out');
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error('Sign out failed');
    }
  };

  const handleViewReport = (analysis) => {
    navigate('/report', { state: { analysis } });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-gray-800/50 bg-[#0a0a0f] flex-col">
        <div className="p-5 border-b border-gray-800/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <span className="font-bold text-white">Fair<span className="text-indigo-400">AI</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600/10 text-indigo-400 text-sm font-medium">
            <span>📊</span> Dashboard
          </a>
          <button
            onClick={() => navigate('/analyze')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800/30 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <span>🔬</span> Analyze
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800/30">
          <div className="flex items-center gap-3 mb-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-gray-700" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{user?.displayName || 'Demo User'}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email || 'demo@fairai.app'}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left text-gray-500 hover:text-red-400 text-xs transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Mobile nav */}
        <nav className="md:hidden border-b border-gray-800/50 bg-[#0a0a0f]/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <span className="font-bold text-white">Fair<span className="text-indigo-400">AI</span></span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-red-400 text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </nav>

        <main className="p-6 md:p-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white">Your Analyses</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {demo && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-600/10 border border-amber-500/20 rounded-full text-amber-400 text-xs mr-2">
                      Demo Mode
                    </span>
                  )}
                  {analyses.length} analysis{analyses.length !== 1 ? 'es' : ''} found
                </p>
              </div>
              <button
                onClick={() => navigate('/analyze')}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
              >
                + Analyze Dataset
              </button>
            </div>

            {/* Analysis cards grid */}
            {analyses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyses.map((analysis, index) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#12121a] border border-gray-800/50 rounded-2xl p-5 hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleViewReport(analysis)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate group-hover:text-indigo-400 transition-colors">
                          {analysis.datasetName}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(analysis.createdAt).toLocaleDateString()} · {analysis.rowCount?.toLocaleString()} rows
                        </p>
                      </div>
                      <MiniScoreRing score={analysis.fairnessScore} />
                    </div>

                    {/* Verdicts */}
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(analysis.columns).map(([col, data]) => {
                        const v = verdictConfig[data.verdict];
                        return (
                          <span
                            key={col}
                            className={`px-2 py-1 rounded-md text-[10px] font-medium ${v.bg} ${v.text} ${v.border} border capitalize`}
                          >
                            {col.replace(/_/g, ' ')}: {data.verdict}
                          </span>
                        );
                      })}
                    </div>

                    <button className="mt-4 w-full py-2 text-center text-indigo-400 text-xs font-medium border border-indigo-500/20 rounded-lg hover:bg-indigo-600/10 transition-colors">
                      View Report →
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#12121a] border border-gray-800/50 mb-6">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">No analyses yet</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                  Upload a CSV dataset to start detecting bias in your AI training data.
                </p>
                <button
                  onClick={() => navigate('/analyze')}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-[0.98]"
                >
                  Upload Your First Dataset
                </button>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
