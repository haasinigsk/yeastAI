import { motion } from 'framer-motion';
import { Beaker, Clock, CheckCircle, XCircle, Pause, TrendingUp } from 'lucide-react';

const statusStyles = {
  active: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400', label: 'Active' },
  completed: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400', label: 'Completed' },
  paused: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400', label: 'Paused' },
  failed: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400', label: 'Failed' },
};

const statusIcons = {
  active: TrendingUp,
  completed: CheckCircle,
  paused: Pause,
  failed: XCircle,
};

export default function BatchOverview({ batches = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Beaker size={16} className="text-neon-purple" />
        <h3 className="text-sm font-semibold text-white">Active Batches</h3>
        <span className="ml-auto badge bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
          {batches.filter(b => b.status === 'active').length} Running
        </span>
      </div>

      <div className="space-y-3">
        {batches.map((batch, i) => {
          const style = statusStyles[batch.status] || statusStyles.active;
          const StatusIcon = statusIcons[batch.status] || TrendingUp;

          return (
            <motion.div
              key={batch._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-3 rounded-xl ${style.bg} border ${style.border} cursor-pointer hover:bg-white/5 transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusIcon size={14} className={style.color} />
                  <span className="text-sm font-semibold text-white font-mono">{batch.batchId}</span>
                </div>
                <span className={`badge ${style.bg} ${style.color} border ${style.border}`}>
                  {style.label}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2 truncate">{batch.yeastStrain}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${batch.progress}%` }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className={`h-full rounded-full bg-gradient-to-r ${
                        batch.status === 'active' ? 'from-emerald-500 to-cyan-500' :
                        batch.status === 'completed' ? 'from-blue-500 to-indigo-500' :
                        batch.status === 'paused' ? 'from-yellow-500 to-orange-500' :
                        'from-red-500 to-pink-500'
                      }`}
                    />
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-400">{batch.progress}%</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><Clock size={10} />{batch.tankId}</span>
                <span>Target: {batch.targetTemp}°C / pH {batch.targetPH}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
