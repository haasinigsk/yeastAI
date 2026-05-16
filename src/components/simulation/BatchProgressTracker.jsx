import { motion } from 'framer-motion';
import { useFermentation } from '../../context/FermentationContext';
import { Check } from 'lucide-react';

export default function BatchProgressTracker() {
  const { stages, currentStageIndex, stageProgress, overallProgress, isRunning, elapsedTime } = useFermentation();

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Batch Progress</h3>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-gray-500">Elapsed: <span className="text-white font-mono">{formatTime(elapsedTime)}</span></span>
          <span className="text-gray-500 font-mono">{Math.round(overallProgress)}%</span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple"
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 0.8 }}
          style={{ boxShadow: '0 0 10px rgba(6,255,209,0.3)' }}
        />
      </div>

      {/* Stage Steps */}
      <div className="flex items-start justify-between relative">
        {/* Connector Line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/5" />
        <motion.div
          className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-blue"
          animate={{ width: `${Math.max(0, (currentStageIndex / (stages.length - 1)) * 100)}%` }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: 'calc(100% - 32px)', boxShadow: '0 0 6px rgba(6,255,209,0.3)' }}
        />

        {stages.map((stage, i) => {
          const isCompleted = i < currentStageIndex;
          const isCurrent = i === currentStageIndex;
          const isFuture = i > currentStageIndex;

          return (
            <div key={stage.id} className="flex flex-col items-center relative z-10" style={{ width: `${100 / stages.length}%` }}>
              {/* Dot */}
              <motion.div
                animate={isCurrent && isRunning ? { scale: [1, 1.2, 1], boxShadow: [`0 0 0px ${stage.color}`, `0 0 12px ${stage.color}`, `0 0 0px ${stage.color}`] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  isCompleted ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan' :
                  isCurrent ? 'border-2 text-white' :
                  'bg-dark-800 border-white/10 text-gray-600'
                }`}
                style={isCurrent ? { borderColor: stage.color, backgroundColor: `${stage.color}20`, color: stage.color } : {}}
              >
                {isCompleted ? <Check size={14} /> : <span>{stage.icon}</span>}
              </motion.div>

              {/* Label */}
              <span className={`text-[9px] mt-2 text-center leading-tight max-w-[60px] ${
                isCurrent ? 'text-white font-medium' : isCompleted ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stage.label}
              </span>

              {/* Stage progress under current */}
              {isCurrent && isRunning && (
                <div className="w-10 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${stageProgress}%` }}
                    style={{ background: stage.color }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
