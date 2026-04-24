import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FuturisticFairnessRing({ score, size = 220 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  // Dynamic color palette
  const getColor = (s) => {
    if (s < 60) return { main: "#ef4444", glow: "rgba(239,68,68,0.4)" };
    if (s < 80) return { main: "#f59e0b", glow: "rgba(245,158,11,0.4)" };
    return { main: "#22c55e", glow: "rgba(34,197,94,0.4)" };
  };

  const getLabel = (s) => {
    if (s < 60)
      return {
        text: "⚠️ Significant Bias Detected",
        sub: "Immediate Review Needed",
      };
    if (s < 80)
      return { text: "⚡ Some Bias Detected", sub: "Review Flagged Columns" };
    return { text: "✅ Generally Fair", sub: "Monitoring in Progress" };
  };

  const color = getColor(score);
  const label = getLabel(score);

  // Animate score counting up
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);
      setAnimatedScore(current);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative flex flex-col items-center gap-5 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] rounded-2xl p-8 border border-white/10 shadow-2xl overflow-hidden"
    >
      {/* Animated glow background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 blur-3xl animate-pulse"></div>
      </div>

      {/* Circular Gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-50 transition-all duration-1000"
          style={{ backgroundColor: color.glow }}
        />

        <svg width={size} height={size} className="relative z-10 -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e1e2e"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color.main}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-[1500ms] ease-out"
            style={{
              filter: `drop-shadow(0 0 12px ${color.glow})`,
            }}
          />
        </svg>

        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold tabular-nums"
            style={{ color: color.main }}
          >
            {animatedScore}
          </motion.span>
          <span className="text-gray-400 text-xs mt-1 uppercase tracking-wider">
            Fairness Score
          </span>
        </div>
      </div>

      {/* Label Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p
          className="text-lg font-semibold"
          style={{
            color: color.main,
            textShadow: `0 0 10px ${color.glow}`,
          }}
        >
          {label.text}
        </p>
        <p className="text-sm text-gray-300">{label.sub}</p>
      </motion.div>
    </motion.div>
  );
}
