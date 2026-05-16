import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', organization: '' });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields'); return; }
    try {
      await register(form);
      navigate('/');
    } catch { setError('Registration failed'); }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const fields = [
    { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Dr. Jane Smith' },
    { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'jane@company.com' },
    { key: 'organization', label: 'Organization', icon: Building, type: 'text', placeholder: 'FermaSense Labs' },
    { key: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
      <p className="text-sm text-gray-500 mb-8">Start monitoring fermentation with AI</p>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-neon-red/10 border border-neon-red/20 text-neon-red text-sm">
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
          <div key={key}>
            <label className="text-xs text-gray-400 mb-1.5 block">{label}</label>
            <div className="relative">
              <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type={type} value={form[key]} onChange={update(key)} className="form-input !pl-11" placeholder={placeholder} />
            </div>
          </div>
        ))}

        <button type="submit" disabled={loading} className="btn-neon w-full flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Create Account</span><ArrowRight size={16} /></>}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-8">
        Already have an account? <Link to="/login" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">Sign in</Link>
      </p>
    </div>
  );
}
