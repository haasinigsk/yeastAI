import { createContext, useContext, useState, useCallback } from 'react';
import { mockUser } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!user;

  const login = useCallback(async (email, password) => {
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    setUser({ ...mockUser, email });
    setLoading(false);
    return true;
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setUser({ ...mockUser, name: data.name, email: data.email, organization: data.organization });
    setLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
