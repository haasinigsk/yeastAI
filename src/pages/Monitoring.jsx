import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { mockBatches, mockChartData } from '../data/mockData';
import LiveChart from '../components/dashboard/LiveChart';
import SensorCard from '../components/dashboard/SensorCard';
import { Play, Square, Settings2, RefreshCw, Zap } from 'lucide-react';

export default function Monitoring() {
  const { liveData, connected, startStreaming, stopStreaming, chartHistory } = useSocket();
  const [selectedBatch, setSelectedBatch] = useState('BATCH-2026-001');
  const [dataLog, setDataLog] = useState([]);

  // Use live chart data if available
  const tempChart = chartHistory.temperature.length > 5 ? chartHistory.temperature : mockChartData.temperature;
  const phChart = chartHistory.ph.length > 5 ? chartHistory.ph : mockChartData.ph;
  const co2Chart = chartHistory.co2.length > 5 ? chartHistory.co2 : mockChartData.co2;
  const turbChart = chartHistory.turbidity.length > 5 ? chartHistory.turbidity : mockChartData.turbidity;

  useEffect(() => {
    if (!connected) return;
    const entry = {
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      temp: liveData.temperature?.value,
      ph: liveData.ph?.value,
      co2: liveData.co2?.value,
      turb: liveData.turbidity?.value,
      do2: liveData.dissolved_oxygen?.value,
      pressure: liveData.pressure?.value,
    };
    setDataLog(prev => [entry, ...prev].slice(0, 30));
  }, [liveData, connected]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="form-input !w-auto !py-2 text-sm">
          {mockBatches.filter(b => b.status === 'active').map(b => (
            <option key={b._id} value={b.batchId}>{b.batchId} — {b.tankId}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <button onClick={connected ? stopStreaming : startStreaming} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${connected ? 'bg-neon-red/10 text-neon-red border border-neon-red/20 hover:bg-neon-red/20' : 'bg-neon-green/10 text-neon-green border border-neon-green/20 hover:bg-neon-green/20'}`}>
            {connected ? <><Square size={14} /> Stop Stream</> : <><Play size={14} /> Start Stream</>}
          </button>
          <button className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors"><RefreshCw size={16} /></button>
          <button className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors"><Settings2 size={16} /></button>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-neon-green pulse-dot' : 'bg-neon-red'}`} />
          <span className={connected ? 'text-neon-green' : 'text-neon-red'}>
            {connected ? 'Streaming Live Data' : 'Stream Paused'}
          </span>
          {connected && <Zap size={12} className="text-neon-yellow animate-pulse" />}
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(liveData).map(([key, data], i) => (
          <SensorCard key={key} type={key} data={data} delay={i * 0.05} />
        ))}
      </div>

      {/* Large Charts — live updating */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveChart data={tempChart} type="temperature" title="Temperature — Real-Time" height={280} />
        <LiveChart data={phChart} type="ph" title="pH Level — Real-Time" height={280} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveChart data={co2Chart} type="co2" title="CO₂ Concentration — Real-Time" height={280} />
        <LiveChart data={turbChart} type="turbidity" title="Turbidity — Real-Time" height={280} />
      </div>

      {/* Live Data Log Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">Live Data Log</h3>
            {connected && <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">{dataLog.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-white/5">
                <th className="text-left py-2 px-3 font-medium">Time</th>
                <th className="text-right py-2 px-3 font-medium">Temp (°C)</th>
                <th className="text-right py-2 px-3 font-medium">pH</th>
                <th className="text-right py-2 px-3 font-medium">CO₂ (%)</th>
                <th className="text-right py-2 px-3 font-medium">Turbidity</th>
                <th className="text-right py-2 px-3 font-medium">DO₂ (mg/L)</th>
                <th className="text-right py-2 px-3 font-medium">Pressure</th>
              </tr>
            </thead>
            <tbody>
              {dataLog.map((row, i) => (
                <motion.tr
                  key={`${row.time}-${i}`}
                  initial={i === 0 ? { opacity: 0, backgroundColor: 'rgba(6,255,209,0.1)' } : { opacity: 0 }}
                  animate={{ opacity: 1, backgroundColor: 'transparent' }}
                  transition={{ duration: 0.8 }}
                  className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-2 px-3 text-gray-400 font-mono">{row.time}</td>
                  <td className="py-2 px-3 text-right text-orange-400 font-mono">{row.temp?.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-blue-400 font-mono">{row.ph?.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-mono">{row.co2?.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-purple-400 font-mono">{row.turb?.toFixed(0)}</td>
                  <td className="py-2 px-3 text-right text-cyan-400 font-mono">{row.do2?.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-yellow-400 font-mono">{row.pressure?.toFixed(3)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {dataLog.length === 0 && (
            <p className="text-center text-gray-600 py-8 text-sm">Waiting for data stream...</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
