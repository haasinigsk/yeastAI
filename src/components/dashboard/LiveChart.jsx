import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 !rounded-lg border border-white/10">
      <p className="text-[10px] text-gray-400 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-mono font-semibold" style={{ color: entry.color }}>
          {entry.value}
        </p>
      ))}
    </div>
  );
};

const chartColors = {
  temperature: { stroke: '#f97316', fill: '#f9731620' },
  ph: { stroke: '#3b82f6', fill: '#3b82f620' },
  co2: { stroke: '#22c55e', fill: '#22c55e20' },
  turbidity: { stroke: '#a855f7', fill: '#a855f720' },
};

export default function LiveChart({ data, type = 'temperature', title, height = 250, showArea = true }) {
  const colors = chartColors[type] || chartColors.temperature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Last 24 hours</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-[10px] text-neon-green font-medium">LIVE</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        {showArea ? (
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.3} />
                <stop offset="100%" stopColor={colors.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.stroke}
              strokeWidth={2}
              fill={`url(#gradient-${type})`}
              dot={false}
              activeDot={{ r: 4, fill: colors.stroke, stroke: '#0f172a', strokeWidth: 2 }}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.stroke}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: colors.stroke, stroke: '#0f172a', strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
}
