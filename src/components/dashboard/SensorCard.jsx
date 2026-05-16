import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Waves, Gauge, Atom, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const sensorConfig = {
  temperature: { icon: Thermometer, unit: '°C', label: 'Temperature', color: 'from-orange-500 to-red-500', glow: 'glow-orange', text: 'text-orange-400', bg: 'bg-orange-500' },
  ph: { icon: Droplets, unit: 'pH', label: 'pH Level', color: 'from-blue-500 to-cyan-500', glow: 'glow-blue', text: 'text-blue-400', bg: 'bg-blue-500' },
  co2: { icon: Wind, unit: '%', label: 'CO₂', color: 'from-emerald-500 to-green-500', glow: 'glow-green', text: 'text-emerald-400', bg: 'bg-emerald-500' },
  turbidity: { icon: Waves, unit: 'NTU', label: 'Turbidity', color: 'from-purple-500 to-pink-500', glow: 'glow-purple', text: 'text-purple-400', bg: 'bg-purple-500' },
  dissolved_oxygen: { icon: Atom, unit: 'mg/L', label: 'Dissolved O₂', color: 'from-cyan-500 to-teal-500', glow: 'glow-cyan', text: 'text-cyan-400', bg: 'bg-cyan-500' },
  pressure: { icon: Gauge, unit: 'atm', label: 'Pressure', color: 'from-yellow-500 to-amber-500', glow: 'glow-orange', text: 'text-yellow-400', bg: 'bg-yellow-500' },
};

const trendIcons = {
  increasing: TrendingUp,
  decreasing: TrendingDown,
  stable: Minus,
};

const statusColors = {
  normal: 'text-neon-green',
  warning: 'text-neon-yellow',
  critical: 'text-neon-red',
};

export default function SensorCard({ type, data, delay = 0 }) {
  const config = sensorConfig[type] || sensorConfig.temperature;
  const Icon = config.icon;
  const TrendIcon = trendIcons[data?.trend] || Minus;
  const percentage = ((data?.value - data?.min) / (data?.max - data?.min)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card p-5 ${config.glow} group cursor-pointer`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{config.label}</p>
            <p className={`text-xs ${statusColors[data?.status] || 'text-gray-400'} capitalize flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${data?.status === 'normal' ? 'bg-neon-green' : data?.status === 'warning' ? 'bg-neon-yellow' : 'bg-neon-red'}`} />
              {data?.status}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs ${config.text}`}>
          <TrendIcon size={14} />
          <span className="capitalize">{data?.trend}</span>
        </div>
      </div>

      {/* Value */}
      <div className="mb-3">
        <motion.span
          key={data?.value}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-3xl font-bold ${config.text} font-mono`}
        >
          {data?.value?.toFixed(type === 'turbidity' ? 0 : 2)}
        </motion.span>
        <span className="text-sm text-gray-500 ml-1.5">{config.unit}</span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
          transition={{ duration: 1, delay: delay + 0.3 }}
          className={`h-full rounded-full bg-gradient-to-r ${config.color}`}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-gray-600">{data?.min}{config.unit}</span>
        <span className="text-[10px] text-gray-600">{data?.max}{config.unit}</span>
      </div>
    </motion.div>
  );
}
