import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-neon-green" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
        <p className="text-sm text-gray-400 mb-8">We've sent a password reset link to <span className="text-white">{email}</span></p>
        <Link to="/login" className="btn-neon inline-flex items-center gap-2">
          Back to Login <ArrowRight size={16} />
        </Link>
      </motion.div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
      <p className="text-sm text-gray-500 mb-8">Enter your email to receive a reset link</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input !pl-11" placeholder="you@company.com" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-neon w-full flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Send Reset Link</span><ArrowRight size={16} /></>}
        </button>
      </form>
      <p className="text-sm text-gray-500 text-center mt-8">
        Remember your password? <Link to="/login" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">Sign in</Link>
      </p>
    </div>
  );
}
