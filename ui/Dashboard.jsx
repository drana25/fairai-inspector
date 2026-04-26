import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const analyses = [
  {
    id: 1,
    datasetName: "RealEstate_Application.csv",
    date: "4/24/2024",
    rows: 4125,
    score: 92,
    verdicts: [
      { name: "Age", status: "PASS" },
      { name: "Gender", status: "PASS" },
      { name: "Race", status: "WARNING" },
    ],
  },
  {
    id: 2,
    datasetName: "Hiring_Dataset.csv",
    date: "4/24/2024",
    rows: 1000,
    score: 80,
    verdicts: [
      { name: "Gender", status: "PASS" },
      { name: "Race", status: "WARNING" },
      { name: "Target", status: "FAIL" },
    ],
  },
  {
    id: 3,
    datasetName: "Loan_Approval.csv",
    date: "4/24/2024",
    rows: 8521,
    score: 53,
    verdicts: [
      { name: "Gender", status: "WARNING" },
      { name: "Marital", status: "FAIL" },
      { name: "Income", status: "FAIL" },
    ],
  },
];

function getColor(status) {
  if (status === "PASS") return "bg-green-500/20 text-green-400";
  if (status === "WARNING") return "bg-amber-500/20 text-amber-400";
  return "bg-red-500/20 text-red-400";
}

function ScoreCircle({ score }) {
  return (
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
      <div
        className="absolute inset-0 rounded-full border-4 border-indigo-500"
        style={{
          clipPath: `inset(${100 - score}% 0 0 0)`
        }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
        {score}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#0a0a0f] text-white">

      {/* Sidebar */}
      <div className="w-60 hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="p-5 border-b border-white/10">
          <h1 className="font-bold text-lg">⚖️ FairAI</h1>
        </div>

        <div className="p-4 space-y-2">
          <div className="bg-indigo-500/20 p-2 rounded-lg">📊 Dashboard</div>
          <button
            onClick={() => navigate("/analyze")}
            className="w-full text-left p-2 hover:bg-white/10 rounded-lg"
          >
            🔬 Analyze
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 md:p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Analyses</h1>
            <p className="text-gray-400 text-sm">3 analyses found</p>
          </div>

          <button
            onClick={() => navigate("/analyze")}
            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl"
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
              className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-105 transition cursor-pointer"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{item.datasetName}</h3>
                  <p className="text-xs text-gray-400">
                    {item.date} • {item.rows} rows
                  </p>
                </div>

                <ScoreCircle score={item.score} />
              </div>

              {/* Verdicts */}
              <div className="flex flex-wrap gap-2">
                {item.verdicts.map((v, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 text-xs rounded ${getColor(v.status)}`}
                  >
                    {v.name}: {v.status}
                  </span>
                ))}
              </div>

              <button className="mt-4 w-full text-indigo-400 text-sm border border-indigo-400/20 rounded-lg py-2 hover:bg-indigo-500/10">
                View Report →
              </button>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {analyses.length === 0 && (
          <div className="text-center mt-20">
            <p>No analyses yet</p>
          </div>
        )}

      </div>
    </div>
  );
}