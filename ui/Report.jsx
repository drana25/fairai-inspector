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
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No data found
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#0a0a0f]">

      {/* HEADER */}
      <div className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-lg">
        <h1 className="font-bold text-lg">⚖️ FairAI</h1>
        <button onClick={() => navigate("/analyze")} className="text-sm text-gray-400 hover:text-white">
          ← Analyze again
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-6">

        {/* TITLE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-3xl font-bold text-center mb-2">
            Bias Report
          </h2>
          <p className="text-center text-gray-400">
            {analysis.datasetName} • {analysis.rowCount} rows
          </p>
        </motion.div>

        {/* FAIRNESS RING */}
        <div className="flex justify-center my-10">
          <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
            <FairnessRing score={analysis.fairnessScore} size={180} />
          </div>
        </div>

        {/* COLUMN CARDS */}
        <div className="space-y-6">
          {Object.entries(analysis.columns).map(([col, data], i) => (
            <motion.div
              key={col}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-[1.01] transition"
            >

              {/* HEADER */}
              <div className="flex justify-between mb-4">
                <h3 className="capitalize text-lg font-semibold">
                  {col.replace("_", " ")}
                </h3>

                <span className={`px-3 py-1 rounded-full text-xs border ${verdictStyles[data.verdict]}`}>
                  {data.verdict}
                </span>
              </div>

              {/* CHART */}
              <BiasChart groups={data.groups} />

              {/* METRICS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                <div className="metric-box">DIR<br/><span>{data.dir.toFixed(3)}</span></div>
                <div className="metric-box">SPD<br/><span>{data.spd.toFixed(3)}</span></div>
                <div className="metric-box">Majority<br/><span>{data.majorityGroup}</span></div>
                <div className="metric-box">Minority<br/><span>{data.minorityGroup}</span></div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mt-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.dir * 100}%` }}
                    className={`h-full ${
                      data.verdict === "PASS"
                        ? "bg-green-500"
                        : data.verdict === "WARNING"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>
              </div>

              {/* AI EXPLANATION */}
              {analysis.explanations?.[col] && (
                <div className="mt-5 p-4 rounded-xl bg-indigo-500/10 border border-indigo-400/20">
                  <p className="text-xs text-indigo-300 mb-1">🤖 AI Insight</p>
                  <p className="text-sm text-gray-300">
                    {analysis.explanations[col]}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* DISCLAIMER */}
        <div className="mt-10 text-center text-xs text-gray-500">
          Results are indicative only. Review professionally.
        </div>

      </div>

      {/* STYLE */}
      <style>
        {`
        .metric-box {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px;
          border-radius: 10px;
          text-align: center;
        }
        .metric-box span {
          font-weight: bold;
          color: white;
        }
        `}
      </style>
    </div>
  );
}