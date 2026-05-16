import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useFermentation } from '../../context/FermentationContext';

const chartConfigs = {
  temperature: { color: '#f97316', label: 'Temperature (°C)', unit: '°C' },
  ph: { color: '#3b82f6', label: 'pH Level', unit: 'pH' },
  co2: { color: '#22c55e', label: 'CO₂ (%)', unit: '%' },
  turbidity: { color: '#a855f7', label: 'Turbidity (NTU)', unit: 'NTU' },
};

const SimTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-1.5 !rounded-lg border border-white/10">
      <p className="text-[9px] text-gray-500">{label}</p>
      <p className="text-xs font-mono font-semibold" style={{ color: payload[0]?.color }}>{payload[0]?.value?.toFixed(2)}</p>
    </div>
  );
};

export default function SimulationCharts() {
  const { chartData, isRunning, currentStage } = useFermentation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(chartConfigs).map(([key, config]) => {
        const data = chartData[key] || [];
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-white">{config.label}</h4>
              <div className="flex items-center gap-1.5">
                {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />}
                <span className="text-[9px] text-gray-500 font-mono">
                  {data.length > 0 ? `${data[data.length - 1]?.value?.toFixed(key === 'turbidity' ? 0 : 2)} ${config.unit}` : '—'}
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={data} margin={{ top: 2, right: 2, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id={`simGrad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={config.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="time" tick={{ fill: '#4b5563', fontSize: 8 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#4b5563', fontSize: 8 }} axisLine={false} tickLine={false} />
                <Tooltip content={<SimTooltip />} />
                <Area type="monotone" dataKey="value" stroke={config.color} strokeWidth={2} fill={`url(#simGrad-${key})`} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        );
      })}
    </div>
  );
}
