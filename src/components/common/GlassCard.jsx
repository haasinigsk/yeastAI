import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, glow = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card p-5 ${hover ? 'hover:border-white/10' : ''} ${glow} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
