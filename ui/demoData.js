import { motion } from "framer-motion";

const DEMO_ANALYSES = [
  {
    id: "demo-1",
    datasetName: "HR Hiring Dataset 2023",
    fairnessScore: 61,
    rowCount: 1247,
    createdAt: "Dec 15, 2025",
    verdict: "Review Required",
    color: "from-orange-500 to-yellow-500",
    biases: [
      {
        icon: "⚠️",
        title: "Gender Bias",
        desc: "Female candidates have a 22% lower hiring rate.",
      },
      {
        icon: "⚡",
        title: "Age Group Bias",
        desc: "Gap between 25–34 and 55+ age groups.",
      },
    ],
  },
  {
    id: "demo-2",
    datasetName: "Loan Approval Model Q4 2025",
    fairnessScore: 43,
    rowCount: 3892,
    createdAt: "Jan 20, 2026",
    verdict: "High Risk Detected",
    color: "from-red-600 to-pink-600",
    biases: [
      {
        icon: "⚠️",
        title: "Racial Bias",
        desc: "Black applicants have a 25% lower approval rate.",
      },
      {
        icon: "⚡",
        title: "Gender Bias",
        desc: "6% gap between male and female approvals.",
      },
    ],
  },
  {
    id: "demo-3",
    datasetName: "Medical Eligibility Screening",
    fairnessScore: 91,
    rowCount: 2156,
    createdAt: "Mar 5, 2026",
    verdict: "Balanced & Fair",
    color: "from-green-500 to-emerald-500",
    biases: [
      {
        icon: "✅",
        title: "Gender Bias",
        desc: "Similar approval rates for males and females.",
      },
    ],
  },
];

export default function FuturisticDemoDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1e1b4b] to-[#0a0a1a] flex flex-wrap justify-center items-center gap-8 p-10">
      {DEMO_ANALYSES.map((demo, i) => (
        <motion.div
          key={demo.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          className={`relative w-80 rounded-2xl p-6 bg-[#0f172a]/80 border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden`}
        >
          {/* Glow border */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${demo.color} opacity-20 blur-xl pointer-events-none`}
          />

          {/* Fairness Score Ring */}
          <div className="flex flex-col items-center mb-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className={`w-24 h-24 rounded-full border-4 border-transparent`}
              style={{
                borderTopColor: "white",
                boxShadow: `0 0 20px rgba(255,255,255,0.3)`,
              }}
            />
            <p
              className="absolute text-4xl font-bold mt-2"
              style={{
                color: "white",
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
            >
              {demo.fairnessScore}
            </p>
            <p className="text-gray-400 text-xs mt-20 uppercase tracking-wider">
              Fairness Score
            </p>
          </div>

          {/* Dataset Info */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {demo.datasetName}
            </h3>
            <p className="text-gray-400 text-xs">
              {demo.rowCount} Rows • Created: {demo.createdAt}
            </p>
          </div>

          {/* Bias Insights */}
          <div className="space-y-2 mb-4">
            {demo.biases.map((b, idx) => (
              <div key={idx} className="text-sm text-gray-300">
                <span className="font-semibold text-white">
                  {b.icon} {b.title}:
                </span>{" "}
                <span className="text-gray-400">{b.desc}</span>
              </div>
            ))}
          </div>

          {/* Verdict */}
          <div
            className={`text-center text-sm font-semibold py-2 rounded-md bg-gradient-to-r ${demo.color} text-white shadow-lg`}
          >
            {demo.verdict}
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-4 w-full py-2 rounded-md bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-medium shadow-lg hover:shadow-indigo-500/50 transition-all"
          >
            View Analysis →
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}
