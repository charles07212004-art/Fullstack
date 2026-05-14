import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const AUTH_STORAGE_KEY = 'thundertube_auth';

const loadAuthState = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return { user: null, isAuthenticated: false };
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load auth state:', error);
    return { user: null, isAuthenticated: false };
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const initialAuth = typeof window !== 'undefined' ? loadAuthState() : { user: null, isAuthenticated: false };
  const [user, setUser] = useState(initialAuth.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, isAuthenticated }));
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  }, [user, isAuthenticated]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...(prev || {}), ...updates }));
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
