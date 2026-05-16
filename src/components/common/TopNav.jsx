import { Bell, Search, Wifi, WifiOff, Clock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pageTitles = {
  '/': 'Dashboard',
  '/monitoring': 'Real-Time Monitoring',
  '/predictions': 'AI Predictions',
  '/alerts': 'Alerts & Notifications',
  '/devices': 'Device Management',
  '/reports': 'Reports & Analytics',
  '/settings': 'Settings',
};

export default function TopNav() {
  const { user } = useAuth();
  const { connected, lastUpdate } = useSocket();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const title = pageTitles[location.pathname] || 'FermaSense AI';
  const time = lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <header className="h-16 bg-dark-900/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left — Title */}
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <Clock size={11} />
          Last update: {time}
        </p>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-2 w-64 focus-within:border-neon-cyan/30 transition-colors">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search batches, devices..."
            className="bg-transparent outline-none text-sm text-gray-300 placeholder-gray-500 w-full"
          />
        </div>

        {/* Connection */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
          connected ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-red/10 text-neon-red'
        }`}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span className="hidden sm:inline">{connected ? 'LIVE' : 'OFFLINE'}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-red rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              4
            </span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 glass-card p-4 space-y-3"
              >
                <h3 className="text-sm font-semibold text-white">Recent Alerts</h3>
                {[
                  { msg: 'Temperature exceeded 35°C in Tank-A1', severity: 'critical', time: '2m ago' },
                  { msg: 'CO₂ levels rising in Tank-B2', severity: 'warning', time: '18m ago' },
                  { msg: 'pH dropping below target range', severity: 'warning', time: '48m ago' },
                  { msg: 'DO Probe Epsilon lost connection', severity: 'critical', time: '15h ago' },
                ].map((alert, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      alert.severity === 'critical' ? 'bg-neon-red pulse-dot' : 'bg-neon-yellow'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 leading-relaxed">{alert.msg}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full text-center text-xs text-neon-cyan hover:text-neon-cyan/80 pt-2 border-t border-white/5">
                  View All Alerts →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-white leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] text-gray-500 capitalize">{user?.role || 'researcher'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
