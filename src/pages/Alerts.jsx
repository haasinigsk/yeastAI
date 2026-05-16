import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockAlerts } from '../data/mockData';
import { useSocket } from '../context/SocketContext';
import { Bell, Check, Trash2, AlertTriangle, Thermometer, Droplets, Wind, Wifi, Brain, Clock, CheckCircle, Eye, EyeOff, Zap } from 'lucide-react';

const alertIcons = { temperature: Thermometer, ph: Droplets, co2: Wind, sensor_disconnect: Wifi, ai_anomaly: Brain, turbidity: AlertTriangle };
const severityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400', label: 'Critical' },
  warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400', label: 'Warning' },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400', label: 'Info' },
};

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Alerts() {
  const { liveAlerts, dismissAlert } = useSocket();
  const [localAlerts, setLocalAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState('all');
  const [showRead, setShowRead] = useState(true);

  // Merge live + static alerts
  const allAlerts = [...liveAlerts, ...localAlerts];

  const filtered = allAlerts.filter(a => {
    if (filter !== 'all' && a.severity !== filter) return false;
    if (!showRead && a.isRead) return false;
    return true;
  });

  const acknowledge = (id) => {
    setLocalAlerts(prev => prev.map(a => a._id === id ? { ...a, isAcknowledged: true, isRead: true } : a));
  };
  const markRead = (id) => {
    setLocalAlerts(prev => prev.map(a => a._id === id ? { ...a, isRead: true } : a));
  };
  const dismiss = (id) => {
    if (id.startsWith('live-')) {
      dismissAlert(id);
    } else {
      setLocalAlerts(prev => prev.filter(a => a._id !== id));
    }
  };

  const counts = {
    all: allAlerts.length,
    critical: allAlerts.filter(a => a.severity === 'critical').length,
    warning: allAlerts.filter(a => a.severity === 'warning').length,
    info: allAlerts.filter(a => a.severity === 'info').length,
  };

  return (
    <div className="space-y-6">
      {/* Live indicator */}
      {liveAlerts.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-cyan/5 border border-neon-cyan/10">
          <Zap size={14} className="text-neon-yellow animate-pulse" />
          <span className="text-xs text-neon-cyan">{liveAlerts.length} new alerts generated in real-time</span>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(counts).map(([key, count]) => {
          const config = severityConfig[key] || { color: 'text-gray-300', bg: 'bg-white/5', border: 'border-white/10', label: 'All' };
          return (
            <motion.button key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => setFilter(key)} className={`glass-card p-4 text-left transition-all ${filter === key ? 'border-neon-cyan/30 glow-cyan' : ''}`}>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{key === 'all' ? 'Total' : config.label}</p>
              <motion.p key={count} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`text-2xl font-bold font-mono ${key === 'all' ? 'text-white' : config.color}`}>{count}</motion.p>
            </motion.button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button onClick={() => setShowRead(!showRead)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${!showRead ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'bg-white/5 text-gray-400 border border-white/5'}`}>
          {showRead ? <Eye size={14} /> : <EyeOff size={14} />}
          {showRead ? 'Showing All' : 'Unread Only'}
        </button>
        <span className="text-xs text-gray-500">{filtered.length} alerts shown</span>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((alert, i) => {
            const config = severityConfig[alert.severity] || severityConfig.info;
            const Icon = alertIcons[alert.type] || AlertTriangle;
            const isLive = alert.isLive;
            return (
              <motion.div
                key={alert._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`glass-card p-4 border ${config.border} ${!alert.isRead ? 'border-l-2' : ''} hover:bg-white/[0.02] transition-colors`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`badge ${config.bg} ${config.color} border ${config.border}`}>{config.label}</span>
                      {isLive && <span className="badge bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 text-[9px]">LIVE</span>}
                      {alert.batchId && <span className="text-[10px] text-gray-500 font-mono">{alert.batchId}</span>}
                      {!alert.isRead && <span className={`w-2 h-2 rounded-full ${config.dot} pulse-dot`} />}
                    </div>
                    <p className="text-sm text-gray-200 mb-1">{alert.message}</p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={10} />{getTimeAgo(alert.createdAt)}</span>
                      {alert.value !== null && <span>Value: <span className="text-white font-mono">{alert.value}</span></span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!alert.isAcknowledged && !isLive && (
                      <button onClick={() => acknowledge(alert._id)} className="p-2 rounded-lg hover:bg-neon-green/10 text-gray-500 hover:text-neon-green transition-colors" title="Acknowledge">
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button onClick={() => dismiss(alert._id)} className="p-2 rounded-lg hover:bg-neon-red/10 text-gray-500 hover:text-neon-red transition-colors" title="Dismiss">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {alert.isAcknowledged && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-neon-green">
                    <Check size={10} /> Acknowledged
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Bell size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No alerts match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
