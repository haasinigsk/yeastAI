import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { FermentationProvider } from './context/FermentationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Simulation from './pages/Simulation';
import Predictions from './pages/Predictions';
import Alerts from './pages/Alerts';
import Devices from './pages/Devices';
import Reports from './pages/Reports';
import Workflow from './pages/Workflow';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public — Landing */}
          <Route path="/landing" element={<Landing />} />

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Protected Dashboard */}
          <Route
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <FermentationProvider>
                    <DashboardLayout />
                  </FermentationProvider>
                </SocketProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/workflow" element={<Workflow />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
