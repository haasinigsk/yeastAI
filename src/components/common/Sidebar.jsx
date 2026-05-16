import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard, Activity, Brain, Bell, Cpu, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Beaker, Wifi, WifiOff,
  Zap, FlaskConical, GitBranch,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/monitoring', label: 'Monitoring', icon: Activity },
  { path: '/simulation', label: 'Simulation', icon: FlaskConical, badge: 'NEW' },
  { path: '/predictions', label: 'AI Predictions', icon: Brain },
  { path: '/alerts', label: 'Alerts', icon: Bell, badge: 4 },
  { path: '/devices', label: 'Devices', icon: Cpu },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/workflow', label: 'Workflow', icon: GitBranch },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const { connected } = useSocket();
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-dark-900/95 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/5">
        <motion.div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center flex-shrink-0">
            <Beaker size={20} className="text-dark-950" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap"
              >
                <h1 className="text-lg font-bold gradient-text leading-tight">FermaSense</h1>
                <p className="text-[10px] text-gray-500 font-mono tracking-wider">AI PLATFORM</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Connection Status */}
      <div className={`mx-3 mt-4 mb-2 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-colors ${connected ? 'bg-neon-green/5 text-neon-green' : 'bg-neon-red/5 text-neon-red'}`}>
        {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {connected ? 'Live Connected' : 'Disconnected'}
            </motion.span>
          )}
        </AnimatePresence>
        {connected && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-green pulse-dot" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                isActive
                  ? 'bg-neon-cyan/10 text-neon-cyan'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-neon-cyan rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={20} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && !collapsed && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${typeof item.badge === 'string' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-neon-red/20 text-neon-red'}`}>
                  {item.badge}
                </span>
              )}
              {item.badge && collapsed && (
                <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${typeof item.badge === 'string' ? 'bg-neon-cyan' : 'bg-neon-red'}`} />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2 border-t border-white/5 pt-3">
        {/* System Status */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 py-2 rounded-lg bg-white/[0.02] text-[11px] text-gray-500"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Zap size={12} className="text-neon-yellow" />
                <span>System Status</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime: 99.7%</span>
                <span className="text-neon-green">Healthy</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-neon-red hover:bg-neon-red/5 transition-all duration-200"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </motion.aside>
  );
}
