import { motion, AnimatePresence } from 'framer-motion';
import { useFermentation } from '../../context/FermentationContext';
import { AlertTriangle, Info, Brain, Bell, Zap, ArrowRight, CheckCircle, Shield } from 'lucide-react';

const typeConfig = {
  stage: { icon: ArrowRight, color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/20' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  insight: { icon: Brain, color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/20' },
  prediction: { icon: Zap, color: 'text-neon-yellow', bg: 'bg-neon-yellow/10', border: 'border-neon-yellow/20' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  alert: { icon: Bell, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  recommendation: { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  success: { icon: CheckCircle, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/20' },
};

export default function EventTimeline({ maxEvents = 20 }) {
  const { timeline } = useFermentation();
  const events = timeline.slice(0, maxEvents);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Live Event Timeline</h3>
        <span className="text-[10px] text-gray-500 font-mono">{timeline.length} events</span>
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {events.map((event) => {
            const config = typeConfig[event.type] || typeConfig.info;
            const Icon = config.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg ${config.bg} border ${config.border}`}
              >
                <div className={`w-6 h-6 rounded-md ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={12} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-200 leading-relaxed">{event.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-gray-500">{event.time}</span>
                    <span className="text-[9px] text-gray-600">•</span>
                    <span className="text-[9px] text-gray-500">{event.stage}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="text-center py-8">
            <Info size={20} className="text-gray-700 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Start a simulation to see events</p>
          </div>
        )}
      </div>
    </div>
  );
}
