import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { mockThresholds, mockNotificationSettings } from '../data/mockData';
import { User, Bell, Shield, Palette, Sliders, Save, Check } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [thresholds, setThresholds] = useState(mockThresholds);
  const [notifications, setNotifications] = useState(mockNotificationSettings);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'thresholds', label: 'Thresholds', icon: Sliders },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'theme', label: 'Theme', icon: Palette },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white'}`}>
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
          <div className="flex items-center gap-6 pb-6 border-b border-white/5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-3xl font-bold text-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <p className="text-xs text-neon-cyan capitalize mt-1">{user?.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', value: user?.name, type: 'text' },
              { label: 'Email', value: user?.email, type: 'email' },
              { label: 'Organization', value: user?.organization || 'FermaSense Labs', type: 'text' },
              { label: 'Role', value: user?.role, type: 'text', disabled: true },
            ].map((field, i) => (
              <div key={i}>
                <label className="text-xs text-gray-400 mb-1.5 block">{field.label}</label>
                <input type={field.type} defaultValue={field.value} disabled={field.disabled} className={`form-input ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`} />
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="btn-neon flex items-center gap-2">
            {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
          </button>
        </motion.div>
      )}

      {/* Thresholds */}
      {activeTab === 'thresholds' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Alert Thresholds</h3>
          <p className="text-sm text-gray-400">Configure when alerts are triggered for each sensor parameter.</p>
          <div className="space-y-6">
            {Object.entries(thresholds).map(([key, values]) => (
              <div key={key} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <h4 className="text-sm font-semibold text-white capitalize">{key.replace('_', ' ')}</h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(values).map(([param, val]) => (
                    <div key={param}>
                      <label className="text-xs text-gray-500 capitalize mb-1 block">{param}</label>
                      <input type="number" defaultValue={val} className="form-input text-sm !py-2" onChange={(e) => setThresholds({ ...thresholds, [key]: { ...thresholds[key], [param]: +e.target.value } })} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="btn-neon flex items-center gap-2">
            {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Thresholds</>}
          </button>
        </motion.div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive alerts via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Text message alerts' },
              { key: 'criticalAlerts', label: 'Critical Alerts', desc: 'Always notify on critical events' },
              { key: 'warningAlerts', label: 'Warning Alerts', desc: 'Notify on warning-level events' },
              { key: 'infoAlerts', label: 'Info Alerts', desc: 'Notify on informational events' },
              { key: 'dailyDigest', label: 'Daily Digest', desc: 'Daily summary email' },
              { key: 'weeklyReport', label: 'Weekly Report', desc: 'Weekly analytics report' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-sm text-white">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <button onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })} className={`relative w-11 h-6 rounded-full transition-colors ${notifications[key] ? 'bg-neon-cyan' : 'bg-dark-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[key] ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="btn-neon flex items-center gap-2">
            {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Preferences</>}
          </button>
        </motion.div>
      )}

      {/* Theme */}
      {activeTab === 'theme' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Theme Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-3 block">Color Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Cyber Dark', colors: ['#030712', '#06ffd1', '#3b82f6'], active: true },
                  { name: 'Deep Ocean', colors: ['#0a1628', '#00d4ff', '#0088cc'], active: false },
                  { name: 'Neon Violet', colors: ['#0d0221', '#b429f9', '#6c23c0'], active: false },
                ].map((theme, i) => (
                  <button key={i} className={`p-4 rounded-xl border transition-all text-left ${theme.active ? 'border-neon-cyan/30 bg-neon-cyan/5 glow-cyan' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}>
                    <div className="flex gap-2 mb-2">
                      {theme.colors.map((c, j) => (
                        <div key={j} className="w-6 h-6 rounded-full border border-white/10" style={{ background: c }} />
                      ))}
                    </div>
                    <p className="text-sm text-white">{theme.name}</p>
                    {theme.active && <p className="text-[10px] text-neon-cyan mt-1">Active</p>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-3 block">Dashboard Density</label>
              <div className="flex gap-3">
                {['Compact', 'Comfortable', 'Spacious'].map((d, i) => (
                  <button key={d} className={`px-4 py-2 rounded-xl text-sm transition-all ${i === 1 ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
