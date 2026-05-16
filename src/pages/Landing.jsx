import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Beaker, Activity, Brain, Bell, Cpu, BarChart3, Shield, ChevronRight, ArrowRight, Zap, Globe, Users, TrendingUp } from 'lucide-react';
import { features } from '../data/mockData';

const iconComponents = { activity: Activity, brain: Brain, bell: Bell, cpu: Cpu, chart: BarChart3, shield: Shield };
const colorMap = { cyan: 'from-neon-cyan to-teal-400', purple: 'from-neon-purple to-indigo-400', orange: 'from-neon-orange to-amber-400', blue: 'from-neon-blue to-cyan-400', green: 'from-neon-green to-emerald-400', pink: 'from-neon-pink to-rose-400' };

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
              <Beaker size={20} className="text-dark-950" />
            </div>
            <span className="text-lg font-bold gradient-text">FermaSense AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#ai" className="hover:text-white transition-colors">AI Engine</a>
            <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Sign In</button>
            <button onClick={() => navigate('/register')} className="btn-neon text-sm !py-2">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-mesh particles-bg">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-medium mb-8">
              <Zap size={14} /> AI-Powered Fermentation Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Monitor Fermentation<br />
              <span className="gradient-text">With Intelligence</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time IoT sensor analytics, predictive AI models, and intelligent alerts for industrial
              and laboratory yeast fermentation processes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => navigate('/register')} className="btn-neon text-base flex items-center gap-2 !px-8 !py-4">
                Start Free Trial <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all text-base">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
            {[
              { value: '99.7%', label: 'Uptime', icon: TrendingUp },
              { value: '< 100ms', label: 'Latency', icon: Zap },
              { value: '500+', label: 'Deployments', icon: Globe },
              { value: '94%', label: 'AI Accuracy', icon: Brain },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <stat.icon size={18} className="text-neon-cyan mx-auto mb-2" />
                <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need to monitor, analyze, and optimize your fermentation processes.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = iconComponents[feature.icon] || Activity;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[feature.color]} flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <Icon size={24} className="text-dark-950" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-20 px-6 bg-mesh">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="badge bg-neon-purple/10 text-neon-purple border border-neon-purple/20 mb-4">
                <Brain size={14} /> Machine Learning
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">AI-Powered Predictions</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">Our ML models analyze real-time sensor streams to predict fermentation endpoints, contamination risks, and optimal harvest windows — before problems occur.</p>
              <div className="space-y-4">
                {['Health score monitoring with 94% accuracy', 'Real-time anomaly detection', 'Yield estimation and optimization', 'Automated corrective recommendations'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
                      <ChevronRight size={12} className="text-neon-purple" />
                    </div>
                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-6 border-glow">
              <div className="space-y-4">
                {[
                  { label: 'Temperature Stability', score: 72, color: 'from-orange-500 to-red-500' },
                  { label: 'pH Consistency', score: 85, color: 'from-blue-500 to-cyan-500' },
                  { label: 'CO₂ Production Rate', score: 90, color: 'from-green-500 to-emerald-500' },
                  { label: 'Contamination Risk', score: 95, color: 'from-purple-500 to-pink-500' },
                  { label: 'Cell Viability', score: 88, color: 'from-cyan-500 to-teal-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-400">{item.label}</span>
                      <span className="text-xs font-mono text-white">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.score}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} className={`h-full rounded-full bg-gradient-to-r ${item.color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Beautiful Dashboard</h2>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto">A futuristic command center designed for scientists and engineers. Every metric at your fingertips.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 border-glow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Active Batches', value: '3', color: 'text-neon-cyan' },
                { label: 'Online Sensors', value: '12', color: 'text-neon-green' },
                { label: 'Health Score', value: '87%', color: 'text-neon-purple' },
                { label: 'Alerts', value: '4', color: 'text-neon-orange' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-3xl font-bold font-mono ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-32 rounded-xl bg-white/[0.02] border border-white/5 flex items-end px-4 pb-4 gap-1">
                  {Array.from({ length: 12 }, (_, j) => (
                    <div key={j} className="flex-1 bg-gradient-to-t from-neon-cyan/40 to-neon-cyan/10 rounded-t-sm" style={{ height: `${30 + Math.random() * 60}%` }} />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-6 bg-mesh">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Why FermaSense AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: 'Increase Yield', desc: 'AI-optimized fermentation parameters lead to 15-25% higher yields.' },
              { icon: Shield, title: 'Reduce Risk', desc: 'Early anomaly detection prevents batch failures before they happen.' },
              { icon: Users, title: 'Scale Operations', desc: 'Monitor hundreds of batches simultaneously with unified dashboards.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass-card p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} className="text-neon-cyan" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
              <Beaker size={16} className="text-dark-950" />
            </div>
            <span className="text-sm font-semibold gradient-text">FermaSense AI</span>
          </div>
          <p className="text-xs text-gray-600">© 2026 FermaSense AI. All rights reserved. AI-Assisted Fermentation Monitoring Platform.</p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
