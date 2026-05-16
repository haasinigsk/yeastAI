import { motion } from 'framer-motion';
import { mockPredictions } from '../data/mockData';
import HealthScoreGauge from '../components/dashboard/HealthScoreGauge';
import { Brain, TrendingDown, AlertTriangle, ShieldCheck, Zap, Target, Clock, Calendar, ChevronRight } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const priorityConfig = {
  high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'High' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Medium' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Low' },
  info: { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Info' },
};

const iconMap = { clock: Clock, shield: ShieldCheck, target: Target, calendar: Calendar };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 !rounded-lg text-xs">
      <p className="text-white font-semibold">{payload[0]?.payload?.name}</p>
      <p className="text-neon-cyan font-mono">{payload[0]?.value}%</p>
    </div>
  );
};

export default function Predictions() {
  const radarData = mockPredictions.riskFactors.map(f => ({ name: f.name.split(' ').slice(0, 2).join(' '), score: f.score }));
  const barData = mockPredictions.riskFactors.map(f => ({ name: f.name.split(' ')[0], score: f.score }));

  return (
    <div className="space-y-6">
      {/* Top Row — Health + Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center glow-green">
          <h3 className="text-sm font-semibold text-white mb-4">Overall Health Score</h3>
          <HealthScoreGauge score={mockPredictions.healthScore} confidence={mockPredictions.confidence} />
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-white/[0.02]">
              <p className="text-gray-500">Risk Level</p>
              <p className="text-neon-green font-semibold capitalize">{mockPredictions.riskLevel}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02]">
              <p className="text-gray-500">Confidence</p>
              <p className="text-neon-cyan font-semibold font-mono">{mockPredictions.confidence}%</p>
            </div>
          </div>
        </motion.div>

        {/* Predictions Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 glow-purple">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-neon-purple" />
            <h3 className="text-sm font-semibold text-white">AI Predictions</h3>
            <Zap size={12} className="ml-auto text-neon-yellow animate-pulse" />
          </div>
          <div className="space-y-3">
            {mockPredictions.predictions.map((pred, i) => {
              const Icon = iconMap[pred.icon] || Zap;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-neon-purple/20 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-neon-purple/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-neon-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-500 capitalize">{pred.type.replace(/_/g, ' ')}</p>
                    <p className="text-xs font-semibold text-white">{pred.value}</p>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{pred.confidence}%</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Risk Factor Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 9 }} />
              <Radar dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Risk Factors Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Risk Factor Scores</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="url(#barGradient)" />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={16} className="text-neon-cyan" />
          <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPredictions.recommendations.map((rec, i) => {
            const config = priorityConfig[rec.priority] || priorityConfig.info;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className={`p-4 rounded-xl ${config.bg} border ${config.border} hover:bg-white/5 transition-colors cursor-pointer`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${config.bg} ${config.color} border ${config.border}`}>{config.label}</span>
                  <ChevronRight size={14} className="ml-auto text-gray-600" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{rec.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">{rec.description}</p>
                <p className="text-[10px] text-neon-cyan">Impact: {rec.impact}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
