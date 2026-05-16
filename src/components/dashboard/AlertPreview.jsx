import { motion } from 'framer-motion';
import { AlertTriangle, Thermometer, Droplets, Wind, Wifi, Brain, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const alertIcons = {
  temperature: Thermometer,
  ph: Droplets,
  co2: Wind,
  sensor_disconnect: Wifi,
  ai_anomaly: Brain,
  turbidity: AlertTriangle,
};

const severityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' },
  warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400' },
};

export default function AlertPreview({ alerts = [] }) {
  const navigate = useNavigate();
  const recentAlerts = alerts.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-neon-orange" />
          <h3 className="text-sm font-semibold text-white">Recent Alerts</h3>
        </div>
        <button
          onClick={() => navigate('/alerts')}
          className="text-xs text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-2">
        {recentAlerts.map((alert, i) => {
          const config = severityConfig[alert.severity] || severityConfig.info;
          const Icon = alertIcons[alert.type] || AlertTriangle;
          const timeAgo = getTimeAgo(alert.createdAt);

          return (
            <motion.div
              key={alert._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} border ${config.border} cursor-pointer hover:bg-white/5 transition-colors`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                <Icon size={16} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">{alert.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] ${config.color} uppercase font-medium`}>{alert.severity}</span>
                  <span className="text-[10px] text-gray-600">•</span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock size={10} />
                    {timeAgo}
                  </span>
                </div>
              </div>
              {!alert.isRead && (
                <span className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0 mt-1 pulse-dot`} />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
