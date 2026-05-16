import { motion } from 'framer-motion';
import { useFermentation } from '../../context/FermentationContext';
import { Thermometer, Droplets, Wind, Waves } from 'lucide-react';
import { useMemo } from 'react';

// Generate deterministic bubble positions
const generateBubbles = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 15 + Math.random() * 70,
    size: 3 + Math.random() * 8,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3,
    opacity: 0.2 + Math.random() * 0.4,
  }));

export default function TankVisualization() {
  const { sensors, healthScore, currentStage, isRunning, stageProgress } = useFermentation();

  const bubbles = useMemo(() => generateBubbles(20), []);

  // Color based on health
  const healthColor = healthScore >= 80 ? '#22c55e' : healthScore >= 60 ? '#eab308' : healthScore >= 40 ? '#f97316' : '#ef4444';
  const liquidColor = healthScore >= 80 ? 'from-emerald-600/40 to-cyan-600/50' : healthScore >= 60 ? 'from-yellow-600/40 to-amber-600/50' : healthScore >= 40 ? 'from-orange-600/40 to-red-600/50' : 'from-red-700/50 to-rose-700/60';

  // Activity level affects bubble count and animation speed
  const activityLevel = currentStage?.id === 'peak_activity' ? 'high' :
    currentStage?.id === 'active_fermentation' ? 'medium' :
    currentStage?.id === 'initializing' || currentStage?.id === 'completed' ? 'low' : 'medium';

  const visibleBubbles = activityLevel === 'high' ? 20 : activityLevel === 'medium' ? 12 : 5;

  return (
    <div className="glass-card p-5 glow-cyan">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Digital Twin — Tank A1</h3>
        <span className="text-[10px] font-mono text-gray-500">{currentStage?.label || 'Idle'}</span>
      </div>

      {/* Tank Visualization */}
      <div className="relative mx-auto w-48 h-64 mb-4">
        {/* Tank Outline */}
        <div className="absolute inset-0 rounded-b-3xl rounded-t-xl border-2 border-white/10 overflow-hidden">
          {/* Liquid Fill */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${liquidColor} rounded-b-3xl`}
            animate={{ height: isRunning ? `${Math.min(30 + stageProgress * 0.5, 85)}%` : '30%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            {/* Wave effect */}
            <div className="absolute -top-2 left-0 right-0 h-4 overflow-hidden">
              <motion.div
                animate={{ x: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 30% 50%, ${healthColor}30 0%, transparent 70%),
                               radial-gradient(ellipse at 70% 50%, ${healthColor}20 0%, transparent 70%)`,
                }}
              />
            </div>

            {/* Bubbles */}
            {isRunning && bubbles.slice(0, visibleBubbles).map(bubble => (
              <motion.div
                key={bubble.id}
                className="absolute rounded-full"
                style={{
                  left: `${bubble.x}%`,
                  width: bubble.size,
                  height: bubble.size,
                  background: `radial-gradient(circle, ${healthColor}${Math.round(bubble.opacity * 255).toString(16).padStart(2, '0')}, transparent)`,
                  border: `1px solid ${healthColor}30`,
                }}
                animate={{
                  bottom: ['10%', '90%'],
                  opacity: [0, bubble.opacity, 0],
                  scale: [0.5, 1, 0.3],
                }}
                transition={{
                  duration: activityLevel === 'high' ? bubble.duration * 0.5 : bubble.duration,
                  delay: bubble.delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Health Ring */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <svg width="60" height="60" className="-rotate-90">
            <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <motion.circle
              cx="30" cy="30" r="25" fill="none" stroke={healthColor} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 25}
              animate={{ strokeDashoffset: 2 * Math.PI * 25 * (1 - healthScore / 100) }}
              transition={{ duration: 1 }}
              style={{ filter: `drop-shadow(0 0 6px ${healthColor}60)` }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono" style={{ color: healthColor }}>
            {healthScore}
          </span>
        </div>

        {/* Temperature indicator (left) */}
        <div className="absolute -left-12 top-1/3 flex flex-col items-center gap-1">
          <Thermometer size={14} className="text-orange-400" />
          <span className="text-[10px] font-mono text-orange-400">{sensors.temperature.toFixed(1)}°C</span>
        </div>

        {/* pH indicator (right) */}
        <div className="absolute -right-10 top-1/3 flex flex-col items-center gap-1">
          <Droplets size={14} className="text-blue-400" />
          <span className="text-[10px] font-mono text-blue-400">{sensors.ph.toFixed(2)}</span>
        </div>

        {/* CO₂ indicator (left bottom) */}
        <div className="absolute -left-12 top-2/3 flex flex-col items-center gap-1">
          <Wind size={14} className="text-emerald-400" />
          <span className="text-[10px] font-mono text-emerald-400">{sensors.co2.toFixed(1)}%</span>
        </div>

        {/* Turbidity indicator (right bottom) */}
        <div className="absolute -right-10 top-2/3 flex flex-col items-center gap-1">
          <Waves size={14} className="text-purple-400" />
          <span className="text-[10px] font-mono text-purple-400">{sensors.turbidity}</span>
        </div>

        {/* Stage glow ring at bottom */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-2 rounded-full"
          animate={{ opacity: isRunning ? [0.4, 0.8, 0.4] : 0.2 }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: `radial-gradient(ellipse, ${currentStage?.color || '#6b7280'}80, transparent)` }}
        />
      </div>

      {/* Status */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <motion.span
            animate={{ scale: isRunning ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg"
          >
            {currentStage?.icon || '⚙️'}
          </motion.span>
          <span className="text-sm font-medium text-white">{currentStage?.label || 'Idle'}</span>
        </div>
        <div className="flex justify-center gap-4 text-[10px]">
          <span className="text-gray-500">Activity: <span className="text-white capitalize">{activityLevel}</span></span>
          <span className="text-gray-500">Health: <span style={{ color: healthColor }} className="font-mono">{healthScore}%</span></span>
        </div>
      </div>
    </div>
  );
}
