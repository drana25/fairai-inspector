import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { DEMO_ANALYSES, isDemoMode, clearDemoMode } from '../data/demoData';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const verdictConfig = {
  PASS: { bg: 'bg-green-500/20', text: 'text-green-400' },
  WARNING: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  FAIL: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

function getScoreRingColor(score) {
  if (score < 60) return '#dc2626';
  if (score < 80) return '#d97706';
  return '#16a34a';
}

function ScoreCircle({ score }) {
  return (
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
      <div
        className="absolute inset-0 rounded-full border-4 shadow-xl"
        style={{
          borderColor: getScoreRingColor(score),
          clipPath: `inset(${100 - score}% 0 0 0)`
        }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
        {score}
      </div>
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
    <div className="min-h-screen flex bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#0a0a0f] text-white">

      {/* Sidebar */}
      <div className="w-60 hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
             <span className="text-xl">⚖️</span>
             <h1 className="font-bold text-lg">FairAI</h1>
          </div>
        </div>

        <div className="p-4 space-y-2 flex-1">
          <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400 font-medium">📊 Dashboard</div>
          <button
            onClick={() => navigate("/analyze")}
            className="w-full text-left p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            🔬 Analyze
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center overflow-hidden">
               {user?.photoURL ? <img src={user.photoURL} alt="" /> : <span className="text-sm">👤</span>}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-white text-sm truncate font-medium">{user?.displayName || 'Demo User'}</p>
               <p className="text-gray-500 text-xs truncate">{user?.email || 'demo@fairai.app'}</p>
             </div>
          </div>
          <button onClick={handleSignOut} className="w-full text-left text-gray-500 hover:text-red-400 text-xs transition-colors p-2">
            Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 md:p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white text-sm transition-all"
            >
              <span className="text-base leading-none">←</span>
              <span className="hidden sm:inline">Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold">Your Analyses</h1>
              <p className="text-gray-400 text-sm mt-1">{analyses.length} analysis{analyses.length !== 1 ? 'es' : ''} found</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/analyze")}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/20 hover:scale-105 transition-all"
          >
            + Analyze Dataset
          </button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleViewReport(item)}
              className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-[1.02] hover:border-indigo-500/30 transition-all cursor-pointer shadow-xl flex flex-col"
            >
              <div className="flex justify-between mb-4 items-start">
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.datasetName}</h3>
                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()} • {item.rowCount} rows
                  </p>
                </div>
                <ScoreCircle score={item.fairnessScore} />
              </div>

              {/* Verdicts */}
              <div className="flex flex-wrap gap-2 mb-4 flex-1">
                {Object.entries(item.columns).map(([col, data]) => {
                   const statusInfo = verdictConfig[data.verdict] || verdictConfig['WARNING'];
                   return (
                     <span
                       key={col}
                       className={`px-2.5 py-1 text-xs font-semibold rounded-md ${statusInfo.bg} ${statusInfo.text} tracking-wide border border-current`}
                     >
                       {col.replace(/_/g, ' ')}: {data.verdict}
                     </span>
                   )
                })}
              </div>

              <button className="w-full text-indigo-400 font-medium text-sm border border-indigo-400/20 rounded-lg py-2 hover:bg-indigo-500/10 transition-colors">
                View Report →
              </button>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {analyses.length === 0 && (
          <div className="text-center mt-32">
             <div className="w-24 h-24 bg-white/5 rounded-3xl mx-auto flex items-center justify-center text-4xl border border-white/10 shadow-2xl mb-6">
               📊
             </div>
            <p className="text-xl font-bold">No analyses yet</p>
            <p className="text-gray-400 mt-2">Upload your first dataset to start detecting bias.</p>
          </div>
        )}

      </div>
    </div>
  );
}
