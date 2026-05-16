import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Beaker, Activity, Shield, Zap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark-950 bg-mesh flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 particles-bg" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
                <Beaker size={28} className="text-dark-950" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">FermaSense AI</h1>
                <p className="text-xs text-gray-500 font-mono tracking-[0.3em]">FERMENTATION INTELLIGENCE</p>
              </div>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-md">
              AI-powered yeast fermentation monitoring platform. Real-time IoT analytics, predictive insights, and intelligent process control.
            </p>
            <div className="space-y-4">
              {[
                { icon: Activity, text: 'Real-time sensor monitoring', color: 'text-neon-cyan' },
                { icon: Zap, text: 'AI-powered predictions', color: 'text-neon-purple' },
                { icon: Shield, text: 'Enterprise-grade security', color: 'text-neon-green' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <item.icon size={18} className={item.color} />
                  <span className="text-sm text-gray-400">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent" />
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
