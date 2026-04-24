import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { DEMO_ANALYSES, isDemoMode, clearDemoMode } from '../data/demoData';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function getColor(status) {
  if (status === "PASS") return "bg-green-500/20 text-green-400";
  if (status === "WARNING") return "bg-amber-500/20 text-amber-400";
  return "bg-red-500/20 text-red-400";
}

function MiniScoreCircle({ score }) {
  return (
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full border-2 border-gray-800"></div>
      <div
        className="absolute inset-0 rounded-full border-2 border-indigo-500"
        style={{
          clipPath: `inset(${100 - score}% 0 0 0)`
        }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
        {score}
      </div>
    </div>
  );
}

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const demo = isDemoMode();
  const history = JSON.parse(localStorage.getItem('fairai_history') || '[]');
  const analyses = demo ? [...history, ...DEMO_ANALYSES] : history;

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
      <div className="w-64 hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <span className="font-bold text-xl">FairAI</span>
          </div>
        </div>

        <div className="p-4 space-y-2 flex-1">
          <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30 text-indigo-400 font-medium cursor-pointer">
             📊 Dashboard
          </div>
          <button
            onClick={() => navigate("/analyze")}
            className="w-full text-left p-3 hover:bg-white/5 rounded-xl transition text-gray-400 hover:text-white"
          >
             🔬 Analyze Dataset
          </button>
        </div>

        <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/20">
                    <span className="text-xl">👤</span>
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate">{user?.displayName || "Demo User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || "demo@fairai.app"}</p>
                </div>
            </div>
            <button 
                onClick={handleSignOut}
                className="w-full text-center py-2 text-xs text-gray-500 hover:text-red-400 transition"
            >
                Sign Out
            </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Audit History</h1>
            <p className="text-gray-400 text-sm">
                {demo && <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full mr-2 border border-amber-400/20">DEMO MODE</span>}
                {analyses.length} total fairness analyses found
            </p>
          </div>

          <button
            onClick={() => navigate("/analyze")}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02]"
          >
            + Analyze New Dataset
          </button>
        </div>

        {/* Cards */}
        {analyses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analyses.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleViewReport(item)}
                className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all cursor-pointer group shadow-2xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="max-w-[70%]">
                    <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors uppercase tracking-tight truncate">
                        {item.datasetName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.createdAt || Date.now()).toLocaleDateString()} • {item.rowCount} rows
                    </p>
                  </div>

                  <MiniScoreCircle score={item.fairnessScore} />
                </div>

                {/* Verdicts */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.entries(item.columns).map(([col, data], idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tighter border ${getColor(data.verdict)}`}
                    >
                      {col.replace(/_/g, ' ')}: {data.verdict}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                    <button className="w-full text-indigo-400 text-sm font-semibold group-hover:gap-3 flex items-center justify-center gap-2 transition-all">
                    View Full Analysis Report <span>→</span>
                    </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center mt-32">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-xl font-bold mb-2">No datasets scanned yet</h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-8 text-sm">
                Start by uploading a dataset to detect potential biases using AI fairness metrics.
            </p>
             <button
                onClick={() => navigate("/analyze")}
                className="text-indigo-400 font-bold border-b-2 border-indigo-400 pb-1"
            >
                Get Started Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
