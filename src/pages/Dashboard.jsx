import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { mockBatches, mockPredictions, mockAlerts, mockChartData } from '../data/mockData';
import SensorCard from '../components/dashboard/SensorCard';
import HealthScoreGauge from '../components/dashboard/HealthScoreGauge';
import LiveChart from '../components/dashboard/LiveChart';
import AlertPreview from '../components/dashboard/AlertPreview';
import BatchOverview from '../components/dashboard/BatchOverview';
import AIInsightPanel from '../components/dashboard/AIInsightPanel';
import { Activity, Cpu, AlertTriangle, Beaker, TrendingUp, Database, X, Bell, Zap } from 'lucide-react';

export default function Dashboard() {
  const {
    liveData, healthScore, healthConfidence, riskLevel,
    liveAlerts, dismissAlert, chartHistory, dataPointCount,
  } = useSocket();

  // Merge live alerts with mock alerts for the preview
  const allAlerts = [...liveAlerts, ...mockAlerts].slice(0, 10);

  // Use live chart history if available, fallback to mock
  const tempChart = chartHistory.temperature.length > 5 ? chartHistory.temperature : mockChartData.temperature;
  const phChart = chartHistory.ph.length > 5 ? chartHistory.ph : mockChartData.ph;
  const co2Chart = chartHistory.co2.length > 5 ? chartHistory.co2 : mockChartData.co2;
  const turbChart = chartHistory.turbidity.length > 5 ? chartHistory.turbidity : mockChartData.turbidity;

  const statCards = [
    { label: 'Active Batches', value: 2, icon: Beaker, color: 'text-neon-cyan', bg: 'from-neon-cyan/20 to-neon-blue/20', border: 'border-neon-cyan/20' },
    { label: 'Online Devices', value: '5/8', icon: Cpu, color: 'text-neon-green', bg: 'from-neon-green/20 to-emerald-500/20', border: 'border-neon-green/20' },
    { label: 'Active Alerts', value: liveAlerts.length + 4, icon: AlertTriangle, color: 'text-neon-orange', bg: 'from-neon-orange/20 to-amber-500/20', border: 'border-neon-orange/20' },
    { label: 'Health Score', value: `${healthScore}%`, icon: TrendingUp, color: 'text-neon-purple', bg: 'from-neon-purple/20 to-indigo-500/20', border: 'border-neon-purple/20' },
    { label: 'Data Points', value: dataPointCount.toLocaleString(), icon: Database, color: 'text-neon-blue', bg: 'from-neon-blue/20 to-cyan-500/20', border: 'border-neon-blue/20' },
    { label: 'System Uptime', value: '99.7%', icon: Activity, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/20' },
  ];

  // Latest live alert for the banner
  const latestLiveAlert = liveAlerts[0];

  return (
    <div className="space-y-6">
      {/* Live Alert Banner */}
      <AnimatePresence>
        {latestLiveAlert && (
          <motion.div
            key={latestLiveAlert._id}
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
              latestLiveAlert.severity === 'critical'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : latestLiveAlert.severity === 'warning'
                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}
          >
            <Bell size={16} className="animate-bounce flex-shrink-0" />
            <span className="text-xs font-medium flex-1">{latestLiveAlert.message}</span>
            <span className="badge bg-white/5 text-[10px] uppercase">{latestLiveAlert.severity}</span>
            <button onClick={() => dismissAlert(latestLiveAlert._id)} className="p-1 hover:bg-white/10 rounded transition-colors">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card p-4 border ${stat.border}`}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.bg} flex items-center justify-center mb-2`}>
              <stat.icon size={16} className={stat.color} />
            </div>
            <motion.p
              key={String(stat.value)}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              className={`text-xl font-bold font-mono ${stat.color}`}
            >
              {stat.value}
            </motion.p>
            <p className="text-[10px] text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Object.entries(liveData).map(([key, data], i) => (
          <SensorCard key={key} type={key} data={data} delay={i * 0.08} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts — 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LiveChart data={tempChart} type="temperature" title="Temperature" height={200} />
            <LiveChart data={phChart} type="ph" title="pH Level" height={200} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LiveChart data={co2Chart} type="co2" title="CO₂ Concentration" height={200} />
            <LiveChart data={turbChart} type="turbidity" title="Turbidity" height={200} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Health Score — live updating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 text-center glow-green"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <h3 className="text-sm font-semibold text-white">Fermentation Health</h3>
              <Zap size={12} className="text-neon-yellow animate-pulse" />
            </div>
            <HealthScoreGauge score={healthScore} confidence={healthConfidence} />
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className={`badge border ${
                riskLevel === 'low' ? 'bg-neon-green/10 text-neon-green border-neon-green/20' :
                riskLevel === 'medium' ? 'bg-neon-yellow/10 text-neon-yellow border-neon-yellow/20' :
                'bg-neon-red/10 text-neon-red border-neon-red/20'
              }`}>
                Risk: {riskLevel}
              </span>
            </div>
          </motion.div>

          {/* AI Insights */}
          <AIInsightPanel predictions={mockPredictions} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BatchOverview batches={mockBatches} />
        <AlertPreview alerts={allAlerts} />
      </div>
    </div>
  );
}
