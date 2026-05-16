import { motion } from 'framer-motion';

export default function HealthScoreGauge({ score = 0, confidence = 0, size = 'large' }) {
  const radius = size === 'large' ? 58 : 40;
  const stroke = size === 'large' ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const viewBoxSize = (radius + stroke) * 2;

  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444';
  const bgColor = score >= 80 ? 'text-neon-green' : score >= 60 ? 'text-neon-yellow' : score >= 40 ? 'text-neon-orange' : 'text-neon-red';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Critical';

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={viewBoxSize} height={viewBoxSize} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={stroke}
          />
          {/* Progress ring */}
          <motion.circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={score}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${size === 'large' ? 'text-3xl' : 'text-xl'} font-bold font-mono ${bgColor}`}
          >
            {score}
          </motion.span>
          {size === 'large' && (
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
          )}
        </div>
      </div>
      {confidence > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Confidence: <span className="text-gray-300 font-mono">{confidence}%</span>
        </p>
      )}
    </div>
  );
}
