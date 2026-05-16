import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDevices } from '../data/mockData';
import { useSocket } from '../context/SocketContext';
import { Cpu, Plus, Wifi, WifiOff, Wrench, Battery, Signal, Clock, Settings2, RefreshCw, Thermometer, Droplets, Wind, Waves, Atom, Gauge, AlertTriangle, Zap } from 'lucide-react';

const statusConfig = {
  online: { color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/20', label: 'Online', dot: 'bg-neon-green' },
  offline: { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Offline', dot: 'bg-gray-500' },
  warning: { color: 'text-neon-yellow', bg: 'bg-neon-yellow/10', border: 'border-neon-yellow/20', label: 'Warning', dot: 'bg-neon-yellow' },
  maintenance: { color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/20', label: 'Maintenance', dot: 'bg-neon-blue' },
};
const typeIcons = { temperature: Thermometer, ph: Droplets, co2: Wind, turbidity: Waves, dissolved_oxygen: Atom, pressure: Gauge };

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Devices() {
  const { deviceStatuses } = useSocket();
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Merge live status overrides
  const devices = mockDevices.map(d => ({
    ...d,
    status: deviceStatuses[d._id] || d.status,
  }));

  const counts = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    warning: devices.filter(d => d.status === 'warning').length,
    offline: devices.filter(d => d.status === 'offline' || d.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Devices', value: counts.total, color: 'text-white', icon: Cpu },
          { label: 'Online', value: counts.online, color: 'text-neon-green', icon: Wifi },
          { label: 'Warnings', value: counts.warning, color: 'text-neon-yellow', icon: AlertTriangle },
          { label: 'Offline', value: counts.offline, color: 'text-gray-500', icon: WifiOff },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <stat.icon size={16} className={`${stat.color} mb-2`} />
            <motion.p key={stat.value} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</motion.p>
            <p className="text-[10px] text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Zap size={12} className="text-neon-yellow animate-pulse" />
        <span>Device statuses update automatically via simulation</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">All Devices</h3>
        <button className="btn-neon text-xs flex items-center gap-2 !py-2 !px-4"><Plus size={14} /> Register Device</button>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map((device, i) => {
          const config = statusConfig[device.status] || statusConfig.offline;
          const TypeIcon = typeIcons[device.type] || Cpu;
          return (
            <motion.div
              key={device._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedDevice(selectedDevice === device._id ? null : device._id)}
              className={`glass-card p-5 cursor-pointer transition-all ${selectedDevice === device._id ? 'border-neon-cyan/30 glow-cyan' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                    <TypeIcon size={18} className={config.color} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{device.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{device.deviceId}</p>
                  </div>
                </div>
                <motion.span
                  key={device.status}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className={`w-2.5 h-2.5 rounded-full ${config.dot} ${device.status === 'online' ? 'pulse-dot' : ''}`}
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={device.status}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={`badge ${config.bg} ${config.color} border ${config.border}`}
                  >
                    {config.label}
                  </motion.span>
                </AnimatePresence>
                {device.assignedBatch && <span className="text-[10px] text-gray-500 font-mono">{device.assignedBatch}</span>}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2 rounded-lg bg-white/[0.02] text-center">
                  <Battery size={12} className={`mx-auto mb-1 ${device.battery > 50 ? 'text-neon-green' : device.battery > 20 ? 'text-neon-yellow' : 'text-neon-red'}`} />
                  <p className="text-[10px] font-mono text-gray-300">{device.battery}%</p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] text-center">
                  <Signal size={12} className="mx-auto mb-1 text-neon-blue" />
                  <p className="text-[10px] font-mono text-gray-300">{device.signalStrength}%</p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] text-center">
                  <RefreshCw size={12} className="mx-auto mb-1 text-gray-400" />
                  <p className="text-[10px] font-mono text-gray-300">{device.firmware}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><Clock size={10} />{getTimeAgo(device.lastSeen)}</span>
                <span>{device.readings.toLocaleString()} readings</span>
              </div>

              {selectedDevice === device._id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-500">Type:</span> <span className="text-gray-300 capitalize">{device.type.replace('_', ' ')}</span></div>
                    <div><span className="text-gray-500">Calibrated:</span> <span className="text-gray-300">{new Date(device.calibratedAt).toLocaleDateString()}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg bg-neon-cyan/10 text-neon-cyan text-xs font-medium hover:bg-neon-cyan/20 transition-colors flex items-center justify-center gap-1"><Wrench size={12} /> Calibrate</button>
                    <button className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 text-xs font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-1"><Settings2 size={12} /> Configure</button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
