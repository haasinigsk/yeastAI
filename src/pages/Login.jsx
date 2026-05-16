import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('sarah@fermasense.io');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    try {
      await login(email, password);
      navigate('/');
    } catch { setError('Login failed'); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
      <p className="text-sm text-gray-500 mb-8">Sign in to your FermaSense AI dashboard</p>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-neon-red/10 border border-neon-red/20 text-neon-red text-sm">
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input !pl-11" placeholder="you@company.com" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input !pl-11" placeholder="••••••••" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded bg-dark-800 border-white/10 accent-neon-cyan" defaultChecked />
            <span className="text-xs text-gray-400">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors">Forgot password?</Link>
        </div>

        <button type="submit" disabled={loading} className="btn-neon w-full flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-8">
        Don't have an account? <Link to="/register" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">Create one</Link>
      </p>

      <div className="mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
        <p className="text-[10px] text-gray-600">Demo credentials pre-filled. Just click Sign In.</p>
      </div>
    </div>
  );
}
