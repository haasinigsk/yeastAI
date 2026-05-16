import { motion } from 'framer-motion';
import { useFermentation } from '../context/FermentationContext';
import ScenarioPlayback from '../components/simulation/ScenarioPlayback';
import BatchProgressTracker from '../components/simulation/BatchProgressTracker';
import TankVisualization from '../components/simulation/TankVisualization';
import SimulationCharts from '../components/simulation/SimulationCharts';
import AIActivityFeed from '../components/simulation/AIActivityFeed';
import EventTimeline from '../components/simulation/EventTimeline';
import HealthScoreGauge from '../components/dashboard/HealthScoreGauge';
import { Beaker, Activity, Zap } from 'lucide-react';

export default function Simulation() {
  const { isRunning, sensors, healthScore, currentStage, elapsedTime, overallProgress, activeScenario } = useFermentation();

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-cyan/5 via-neon-blue/5 to-neon-purple/5 border border-neon-cyan/10"
        >
          <div className="flex items-center gap-2">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <Activity size={16} className="text-neon-cyan" />
            </motion.div>
            <span className="text-sm font-medium text-white">Simulation Active</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs text-gray-400">
            Stage: <span className="text-white">{currentStage?.label}</span>
          </span>
          <span className="text-xs text-gray-400">
            Elapsed: <span className="text-white font-mono">{formatTime(elapsedTime)}</span>
          </span>
          <span className="text-xs text-gray-400">
            Progress: <span className="text-neon-cyan font-mono">{Math.round(overallProgress)}%</span>
          </span>
          {activeScenario !== 'normal' && (
            <span className="badge bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px]">
              {activeScenario.replace(/_/g, ' ').toUpperCase()}
            </span>
          )}
          <Zap size={12} className="ml-auto text-neon-yellow animate-pulse" />
        </motion.div>
      )}

      {/* Scenario Playback */}
      <ScenarioPlayback />

      {/* Progress Tracker */}
      <BatchProgressTracker />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tank + Health — 1 column */}
        <div className="space-y-6">
          <TankVisualization />
          {/* Live Sensor Readout */}
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-white mb-3">Live Readout</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Temp', value: `${sensors.temperature.toFixed(1)}°C`, color: 'text-orange-400' },
                { label: 'pH', value: sensors.ph.toFixed(2), color: 'text-blue-400' },
                { label: 'CO₂', value: `${sensors.co2.toFixed(1)}%`, color: 'text-emerald-400' },
                { label: 'Turb', value: `${sensors.turbidity} NTU`, color: 'text-purple-400' },
              ].map((s, i) => (
                <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-[9px] text-gray-500">{s.label}</p>
                  <motion.p key={s.value} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</motion.p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts — 2 columns */}
        <div className="lg:col-span-2">
          <SimulationCharts />
        </div>

        {/* AI Feed + Timeline — 1 column */}
        <div className="space-y-6">
          <AIActivityFeed />
        </div>
      </div>

      {/* Event Timeline — Full Width */}
      <EventTimeline maxEvents={30} />
    </div>
  );
}
