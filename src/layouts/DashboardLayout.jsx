import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import TopNav from '../components/common/TopNav';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-dark-950 bg-mesh">
      <Sidebar />
      <div className="ml-[260px] transition-all duration-300">
        <TopNav />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
