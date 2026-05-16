import { motion } from 'framer-motion';
import { Cpu, Wifi, Server, Brain, Bell, BarChart3, Monitor, Database, Shield, Zap, ArrowDown, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const workflowSteps = [
  {
    id: 'sensors',
    icon: Cpu,
    title: 'IoT Sensors',
    subtitle: 'Data Acquisition Layer',
    description: 'Temperature probes, pH electrodes, CO₂ analyzers, and turbidity sensors collect raw fermentation data at 1Hz sampling rate.',
    color: '#f97316',
    details: ['Temperature: ±0.1°C accuracy', 'pH: ±0.01 resolution', 'CO₂: IR-based detection', 'Turbidity: 880nm nephelometry'],
  },
  {
    id: 'iot',
    icon: Wifi,
    title: 'IoT Data Collection',
    subtitle: 'Communication Layer',
    description: 'MQTT protocol transmits sensor data over encrypted channels. Edge gateways aggregate and buffer readings for reliability.',
    color: '#3b82f6',
    details: ['MQTT v5 protocol', 'TLS 1.3 encryption', 'QoS Level 1 delivery', 'Edge buffering: 24h'],
  },
  {
    id: 'edge',
    icon: Server,
    title: 'Edge Processing',
    subtitle: 'Pre-processing Layer',
    description: 'Local edge nodes perform signal filtering, outlier detection, and data normalization before cloud transmission.',
    color: '#06b6d4',
    details: ['Kalman filtering', 'Outlier rejection', 'Data normalization', 'Local anomaly flags'],
  },
  {
    id: 'ai',
    icon: Brain,
    title: 'AI Analytics Engine',
    subtitle: 'Intelligence Layer',
    description: 'Machine learning models analyze time-series data to predict fermentation outcomes, detect anomalies, and generate health scores.',
    color: '#a855f7',
    details: ['LSTM time-series model', 'Random forest classifier', 'Anomaly autoencoder', 'Health score regression'],
  },
  {
    id: 'prediction',
    icon: Zap,
    title: 'Prediction System',
    subtitle: 'Forecasting Layer',
    description: 'Predictive models forecast fermentation endpoints, contamination probabilities, yield estimates, and optimal harvest windows.',
    color: '#eab308',
    details: ['Endpoint prediction: ±2h', 'Contamination risk: 94% accuracy', 'Yield estimate: ±3%', 'Real-time confidence scoring'],
  },
  {
    id: 'alerts',
    icon: Bell,
    title: 'Alert Generation',
    subtitle: 'Notification Layer',
    description: 'Intelligent alert engine evaluates threshold breaches, AI anomalies, and predictive warnings. Auto-escalation based on severity.',
    color: '#ef4444',
    details: ['Multi-severity levels', 'Auto-escalation rules', 'Deduplication logic', 'Push/email/SMS delivery'],
  },
  {
    id: 'dashboard',
    icon: Monitor,
    title: 'Dashboard Visualization',
    subtitle: 'Presentation Layer',
    description: 'Real-time dashboard renders live data, interactive charts, digital twin, and AI insights through a responsive web interface.',
    color: '#06ffd1',
    details: ['WebSocket streaming', 'Sub-second latency', 'Interactive charts', 'Mobile responsive'],
  },
];

export default function Workflow() {
  const [activeStep, setActiveStep] = useState(null);
  const [animating, setAnimating] = useState(true);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">System Architecture</h1>
        <p className="text-sm text-gray-400">End-to-end fermentation monitoring data flow</p>
      </motion.div>

      {/* Data Flow Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 text-xs text-neon-cyan"
      >
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-1"
        >
          <Database size={14} /> Raw Data
        </motion.div>
        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-gray-600">→→→</motion.div>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="flex items-center gap-1"
        >
          <Brain size={14} /> Intelligence
        </motion.div>
        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-gray-600">→→→</motion.div>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="flex items-center gap-1"
        >
          <Monitor size={14} /> Insight
        </motion.div>
      </motion.div>

      {/* Workflow Steps */}
      <div className="space-y-0">
        {workflowSteps.map((step, i) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          const isLast = i === workflowSteps.length - 1;

          return (
            <div key={step.id}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                onClick={() => setActiveStep(isActive ? null : step.id)}
                className={`glass-card p-5 cursor-pointer transition-all ${isActive ? 'border-white/15' : ''}`}
                style={isActive ? { boxShadow: `0 0 30px ${step.color}15` } : {}}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number + Icon */}
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      animate={animating ? { boxShadow: [`0 0 0px ${step.color}`, `0 0 15px ${step.color}50`, `0 0 0px ${step.color}`] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center border"
                      style={{ background: `${step.color}15`, borderColor: `${step.color}30` }}
                    >
                      <Icon size={22} style={{ color: step.color }} />
                    </motion.div>
                    <span className="text-[9px] font-mono text-gray-600">0{i + 1}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                      <span className="text-[10px] text-gray-500 font-mono">{step.subtitle}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>

                    {/* Expanded Details */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-white/5"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {step.details.map((detail, j) => (
                            <motion.div
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.1 }}
                              className="flex items-center gap-2 text-[10px]"
                            >
                              <div className="w-1 h-1 rounded-full" style={{ background: step.color }} />
                              <span className="text-gray-300">{detail}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Data flow pulse */}
                  <motion.div
                    animate={animating ? { scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-3 h-3 rounded-full flex-shrink-0 mt-2"
                    style={{ background: step.color }}
                  />
                </div>
              </motion.div>

              {/* Connector Arrow */}
              {!isLast && (
                <div className="flex justify-center py-1">
                  <motion.div
                    animate={animating ? { y: [0, 4, 0], opacity: [0.3, 0.8, 0.3] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <ChevronDown size={20} className="text-gray-600" />
                  </motion.div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Architecture Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="glass-card p-6 border-glow"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-neon-cyan" />
          <h3 className="text-sm font-semibold text-white">Architecture Highlights</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'End-to-End Latency', value: '< 100ms' },
            { label: 'Data Throughput', value: '10K pts/sec' },
            { label: 'Model Accuracy', value: '94.2%' },
            { label: 'System Uptime', value: '99.97%' },
          ].map((item, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-lg font-bold font-mono text-neon-cyan">{item.value}</p>
              <p className="text-[10px] text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
