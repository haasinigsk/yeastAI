import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, TrendingUp, Beaker, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { mockTrends } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 !rounded-lg text-xs border border-white/10">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-mono">{entry.name}: {entry.value}</p>
      ))}
    </div>
  );
};

export default function Reports() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('trends');

  const tabs = [
    { key: 'trends', label: 'Trend Analysis' },
    { key: 'comparison', label: 'Batch Comparison' },
    { key: 'yield', label: 'Yield Report' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="form-input !w-auto !py-2 text-sm">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="btn-neon text-xs flex items-center gap-2 !py-2 !px-4">
            <Download size={14} /> Export PDF
          </button>
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white text-xs flex items-center gap-2 transition-colors">
            <Download size={14} /> CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Temperature', value: '28.4°C', change: '+0.3°C', trend: 'up' },
          { label: 'Avg pH', value: '4.52', change: '-0.08', trend: 'down' },
          { label: 'Avg CO₂', value: '12.8%', change: '+1.2%', trend: 'up' },
          { label: 'Avg Yield', value: '91.4%', change: '+2.1%', trend: 'up' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <p className="text-[10px] text-gray-500 mb-1">{stat.label}</p>
            <p className="text-xl font-bold font-mono text-white">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-neon-green' : 'text-neon-red'}`}>
              <TrendingUp size={12} className="inline mr-1" />{stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Temperature Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={mockTrends.temperature} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} fill="url(#tempGrad)" name="Actual" />
                  <Area type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={1.5} fill="none" strokeDasharray="5 5" name="Predicted" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">pH Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={mockTrends.ph} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="phGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#phGrad)" name="Actual" />
                  <Area type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={1.5} fill="none" strokeDasharray="5 5" name="Predicted" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">CO₂ Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={mockTrends.co2} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#co2Grad)" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Turbidity Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={mockTrends.turbidity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="turbGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} fill="url(#turbGrad)" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Batch Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={[
              { name: 'BATCH-001', yield: 94, health: 87, efficiency: 91 },
              { name: 'BATCH-002', yield: 88, health: 93, efficiency: 85 },
              { name: 'BATCH-003', yield: 95, health: 95, efficiency: 93 },
              { name: 'BATCH-004', yield: 72, health: 61, efficiency: 68 },
              { name: 'BATCH-089', yield: 55, health: 22, efficiency: 45 },
            ]} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Bar dataKey="yield" fill="#06ffd1" name="Yield %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="health" fill="#a855f7" name="Health" radius={[4, 4, 0, 0]} />
              <Bar dataKey="efficiency" fill="#3b82f6" name="Efficiency" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {activeTab === 'yield' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Monthly Yield Report (2026)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mockTrends.yield} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} domain={[70, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Line type="monotone" dataKey="actual" stroke="#06ffd1" strokeWidth={2} dot={{ r: 4, fill: '#06ffd1' }} name="Actual Yield %" />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
