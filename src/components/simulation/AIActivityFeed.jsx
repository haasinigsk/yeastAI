import { motion, AnimatePresence } from 'framer-motion';
import { useFermentation } from '../../context/FermentationContext';
import { Brain, Zap, Shield, Target, Clock, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const msgIcons = { info: Info, insight: Brain, prediction: Zap, warning: AlertTriangle, alert: AlertTriangle, recommendation: Shield, success: CheckCircle };
const msgColors = { info: 'text-blue-400', insight: 'text-neon-purple', prediction: 'text-neon-yellow', warning: 'text-yellow-400', alert: 'text-red-400', recommendation: 'text-emerald-400', success: 'text-neon-green' };

export default function AIActivityFeed() {
  const { aiMessages, healthScore, predictions, riskFactors, isRunning } = useFermentation();

  return (
    <div className="glass-card p-5 glow-purple">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
          <Brain size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">AI Activity Feed</h3>
          <p className="text-[10px] text-gray-500">FermaSense ML Engine</p>
        </div>
        {isRunning && <Zap size={14} className="ml-auto text-neon-yellow animate-pulse" />}
      </div>

      {/* Quick Predictions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: 'Completion', value: predictions.fermentationEnd, icon: Clock },
          { label: 'Contamination', value: predictions.contaminationRisk, icon: Shield },
          { label: 'Yield Est.', value: predictions.yieldEstimate, icon: Target },
          { label: 'Harvest', value: predictions.optimalHarvest, icon: Zap },
        ].map((pred, i) => (
          <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
            <pred.icon size={12} className="text-neon-purple mb-1" />
            <p className="text-[9px] text-gray-500">{pred.label}</p>
            <motion.p key={pred.value} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="text-[11px] font-semibold text-white font-mono truncate">{pred.value}</motion.p>
          </div>
        ))}
      </div>

      {/* Risk Gauges */}
      <div className="space-y-2 mb-4">
        {Object.entries(riskFactors).map(([key, score]) => {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
          const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
          return (
            <div key={key}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] text-gray-500">{label}</span>
                <span className="text-[10px] font-mono" style={{ color }}>{score}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" animate={{ width: `${score}%` }} style={{ background: color }} transition={{ duration: 0.5 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Feed */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        <AnimatePresence initial={false}>
          {aiMessages.slice(0, 8).map((msg) => {
            const Icon = msgIcons[msg.type] || Info;
            const color = msgColors[msg.type] || 'text-gray-400';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
              >
                <Icon size={12} className={`${color} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-300 leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] text-gray-600 font-mono">{msg.time}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {aiMessages.length === 0 && (
          <p className="text-center text-[10px] text-gray-600 py-4">Waiting for simulation data...</p>
        )}
      </div>
    </div>
  );
}
