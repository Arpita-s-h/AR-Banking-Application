import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, restore user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('ar_token');
    const saved = localStorage.getItem('ar_user');
    if (token && saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('ar_token', token);
    localStorage.setItem('ar_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ar_token');
    localStorage.removeItem('ar_user');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'ROLE_ADMIN';
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);