import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const GROUP_COLORS = [
  "#3b82f6", // Blue
  "#ec4899", // Pink
  "#10b981", // Green
  "#fbbf24", // Yellow
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#1a1a2e]/90 border border-indigo-500/40 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md"
    >
      <p className="text-white font-semibold text-sm">{label}</p>
      <p className="text-cyan-300 text-xs mt-1">
        Rate: {(payload[0].value * 100).toFixed(1)}%
      </p>
      <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
        ✅ {payload[0].payload.positive} / {payload[0].payload.total} positive
      </p>
    </motion.div>
  );
}

export default function FuturisticBiasChart({ groups, columnName }) {
  const data = groups.map((g) => ({
    name: g.name,
    rate: g.rate,
    positive: g.positive,
    total: g.total,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] rounded-2xl p-6 border border-white/10 shadow-2xl overflow-hidden"
    >
      {/* Animated light trails */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 blur-3xl animate-pulse"></div>
      </div>

      <h2 className="text-lg font-semibold text-white mb-4 text-center">
        {columnName} Fairness Overview
      </h2>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#1e293b" }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#1e293b" }}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            domain={[0, 1]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(99,102,241,0.1)" }}
          />
          <Bar
            dataKey="rate"
            radius={[12, 12, 0, 0]}
            maxBarSize={70}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={GROUP_COLORS[index % GROUP_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Footer */}
      <div className="mt-6 text-center text-gray-300 text-xs italic flex items-center justify-center gap-2">
        <span className="animate-pulse">🖱️</span> Hover over bars for interactive insights
      </div>
    </motion.div>
  );
}
