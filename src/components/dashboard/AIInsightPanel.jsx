import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Target, Clock, Calendar } from 'lucide-react';

const iconMap = { clock: Clock, shield: Shield, target: Target, calendar: Calendar };

export default function AIInsightPanel({ predictions }) {
  if (!predictions) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 glow-purple">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
          <Brain size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">AI Insights</h3>
          <p className="text-[10px] text-gray-500">FermaSense ML Engine</p>
        </div>
        <Zap size={14} className="ml-auto text-neon-yellow animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {predictions.predictions?.map((pred, i) => {
          const Icon = iconMap[pred.icon] || Zap;
          return (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <Icon size={14} className="text-neon-purple mb-1.5" />
              <p className="text-[10px] text-gray-500 capitalize">{pred.type.replace(/_/g, ' ')}</p>
              <p className="text-xs font-semibold text-white mt-0.5">{pred.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-blue" style={{ width: `${pred.confidence}%` }} />
                </div>
                <span className="text-[9px] text-gray-500 font-mono">{pred.confidence}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      {predictions.recommendations?.[0] && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-[10px] font-medium uppercase text-red-400 mb-1">High Priority</p>
          <p className="text-xs font-semibold text-white">{predictions.recommendations[0].title}</p>
          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-2">{predictions.recommendations[0].description}</p>
        </div>
      )}
    </motion.div>
  );
}
