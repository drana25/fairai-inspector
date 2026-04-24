import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FairnessRing from "../components/FairnessRing";
import BiasChart from "../components/BiasChart";

const verdictStyles = {
  PASS: "text-green-400 border-green-500/30 bg-green-500/10",
  WARNING: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  FAIL: "text-red-400 border-red-500/30 bg-red-500/10",
};

export default function Report() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const analysis = state?.analysis;

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#0a0a0f]">
        No data found
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#0a0a0f] pb-20">

      {/* HEADER */}
      <div className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-lg sticky top-0 z-50 bg-[#0a0a0f]/50">
        <h1 className="font-bold text-lg cursor-pointer" onClick={() => navigate('/dashboard')}>⚖️ FairAI</h1>
        <button onClick={() => navigate("/analyze")} className="text-sm font-medium text-gray-400 hover:text-white transition px-4 py-2 rounded-lg bg-white/5 border border-white/5">
          ← Start New Audit
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-10">

        {/* TITLE */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-3">
             Fairness Audit Report
          </h2>
          <div className="flex items-center justify-center gap-3">
              <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest">{analysis.datasetName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-700"></span>
              <span className="text-gray-400 text-sm">{analysis.rowCount.toLocaleString()} rows analyzed</span>
          </div>
        </motion.div>

        {/* FAIRNESS RING */}
        <div className="flex justify-center mb-16">
          <div className="p-2 rounded-[2.5rem] bg-indigo-500/5 backdrop-blur-xl border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
            <FairnessRing score={analysis.fairnessScore} size={240} />
          </div>
        </div>

        {/* COLUMN CARDS */}
        <div className="space-y-10">
            <h3 className="text-xl font-bold border-l-4 border-indigo-500 pl-4 mb-6">Detailed Protected Attribute Analysis</h3>
          {Object.entries(analysis.columns).map(([col, data], i) => (
            <motion.div
              key={col}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-[#12121a]/80 backdrop-blur-2xl border border-white/5 hover:border-white/10 shadow-2xl transition-all"
            >

              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="capitalize text-2xl font-bold tracking-tight mb-1 text-indigo-100">
                    {col.replace(/_/g, " ")}
                    </h3>
                    <p className="text-sm text-gray-500">Distribution and outcome parity across groups</p>
                </div>

                <div className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 shadow-lg ${verdictStyles[data.verdict]}`}>
                  {data.verdict === 'PASS' ? '✅ COMPLIANT' : data.verdict === 'WARNING' ? '⚠️ MONITORING' : '❌ BIAS DETECTED'}
                </div>
              </div>

              {/* GRID FOR CHART AND METRICS */}
              <div className="grid lg:grid-cols-5 gap-8 items-start">
                  
                  {/* CHART */}
                  <div className="lg:col-span-3">
                      <BiasChart groups={data.groups} columnName={col.replace(/_/g, " ")} />
                  </div>

                  {/* METRICS */}
                  <div className="lg:col-span-2 space-y-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-3">Key Fairness Indicators</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="metric-box">
                                <span className="label">Disparate Impact Ratio (DIR)</span>
                                <span className="value">{data.dir.toFixed(3)}</span>
                            </div>
                            <div className="metric-box">
                                <span className="label">Stat. Parity Diff (SPD)</span>
                                <span className="value">{data.spd.toFixed(3)}</span>
                            </div>
                          </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-3">Group Representation</p>
                          <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-400">Majority Group</span>
                                  <span className="font-bold text-white">{data.majorityGroup}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-400">Minority Group</span>
                                  <span className="font-bold text-white">{data.minorityGroup}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mt-8">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-gray-500 mb-2">
                    <span>Bias Intensity</span>
                    <span>{Math.round(data.dir * 100)}% Harmony</span>
                </div>
                <div className="h-4 bg-gray-900 rounded-full overflow-hidden p-[2px] border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(data.dir * 100, 100)}%` }}
                    viewport={{ once: true }}
                    className={`h-full rounded-full transition-all duration-1000 ${
                      data.verdict === "PASS"
                        ? "bg-gradient-to-r from-emerald-600 to-green-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                        : data.verdict === "WARNING"
                        ? "bg-gradient-to-r from-amber-600 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                        : "bg-gradient-to-r from-red-600 to-pink-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    }`}
                  />
                </div>
              </div>

              {/* AI EXPLANATION */}
              {analysis.explanations?.[col] && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-8 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <span className="text-4xl">🤖</span>
                  </div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">AI Fairness Insight</p>
                  <p className="text-sm text-gray-300 leading-relaxed relative z-10">
                    {analysis.explanations[col]}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* DISCLAIMER */}
        <div className="mt-16 p-8 rounded-3xl border border-white/5 bg-white/5 text-center">
            <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto">
              This report is generated using advanced algorithmic fairness metrics including Disparate Impact Ratio and Statistical Parity Difference. Results are indicative of patterns in the training data and should be reviewed by legal and ethics professionals before deployment in production systems.
            </p>
        </div>

      </div>

      {/* GLOBAL STYLES */}
      <style>
        {`
        .metric-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .metric-box .label {
          font-size: 8px;
          text-transform: uppercase;
          color: #6b7280;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .metric-box .value {
          font-size: 18px;
          font-weight: 900;
          color: white;
          font-variant-numeric: tabular-nums;
        }
        `}
      </style>
    </div>
  );
}
