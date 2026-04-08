import { useEffect, useState } from 'react';

export default function FairnessRing({ score, size = 200 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  // Determine color based on score
  const getColor = (s) => {
    if (s < 60) return { main: '#dc2626', glow: 'rgba(220,38,38,0.3)' };
    if (s < 80) return { main: '#d97706', glow: 'rgba(217,119,6,0.3)' };
    return { main: '#16a34a', glow: 'rgba(22,163,74,0.3)' };
  };

  const getLabel = (s) => {
    if (s < 60) return { text: '⚠️ Significant bias detected', sub: 'Immediate review recommended' };
    if (s < 80) return { text: '⚡ Some bias detected', sub: 'Review flagged columns' };
    return { text: '✅ Generally fair', sub: 'Continue monitoring' };
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
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);
      setAnimatedScore(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-50 transition-all duration-1000"
          style={{ backgroundColor: color.glow }}
        />

        <svg width={size} height={size} className="relative z-10 -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e1e2e"
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
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
              filter: `drop-shadow(0 0 8px ${color.glow})`,
            }}
          />
        </svg>

        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span
            className="text-5xl font-bold tabular-nums"
            style={{ color: color.main }}
          >
            {animatedScore}
          </span>
          <span className="text-gray-500 text-xs mt-1 uppercase tracking-wider">
            Fairness Score
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-lg font-semibold text-white">{label.text}</p>
        <p className="text-sm text-gray-400">{label.sub}</p>
      </div>
    </div>
  );
}
