import { motion } from 'framer-motion';
import { useFermentation } from '../../context/FermentationContext';
import { Play, Square, RotateCcw, Thermometer, Droplets, Wifi, AlertTriangle, Beaker } from 'lucide-react';

const scenarioIcons = {
  normal: Beaker,
  temp_spike: Thermometer,
  ph_failure: Droplets,
  sensor_disconnect: Wifi,
  critical_instability: AlertTriangle,
};

const scenarioColors = {
  normal: 'from-neon-green/20 to-emerald-500/20 border-neon-green/30 text-neon-green',
  temp_spike: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400',
  ph_failure: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
  sensor_disconnect: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400',
  critical_instability: 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400',
};

export default function ScenarioPlayback() {
  const { scenarios, isRunning, startSimulation, stopSimulation, resetSimulation, activeScenario } = useFermentation();

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Scenario Playback</h3>
        <div className="flex items-center gap-2">
          {isRunning && (
            <button onClick={stopSimulation} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-red/10 text-neon-red border border-neon-red/20 text-xs font-medium hover:bg-neon-red/20 transition-colors">
              <Square size={12} /> Stop
            </button>
          )}
          <button onClick={resetSimulation} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 border border-white/5 text-xs font-medium hover:text-white hover:bg-white/10 transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(scenarios).map(([key, scenario]) => {
          const Icon = scenarioIcons[key] || Beaker;
          const colors = scenarioColors[key] || scenarioColors.normal;
          const isActive = isRunning && activeScenario === key;

          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startSimulation(key)}
              disabled={isRunning}
              className={`relative p-4 rounded-xl bg-gradient-to-br ${colors} border text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed group ${isActive ? 'ring-1 ring-white/20' : ''}`}
            >
              {isActive && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-green"
                />
              )}
              <Icon size={20} className="mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
              <p className="text-xs font-semibold text-white mb-0.5">{scenario.label}</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">{scenario.description}</p>
              {!isRunning && (
                <div className="flex items-center gap-1 mt-2 text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">
                  <Play size={10} /> Run Scenario
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
