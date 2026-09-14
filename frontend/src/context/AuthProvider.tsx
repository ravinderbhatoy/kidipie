import { useState, useContext, type ReactNode } from 'react';
import { api } from '../api/axios';
import { AuthContext } from './AuthContext';

// --- Types ---
export type User = {
  id: string;
  email: string;
  name?: string;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
};

export interface UserCredentials {
  email: string;
  password: string;
}

type Tokens = {
  access_token: string;
  refresh_token: string;
  user_id: string;
};

// --- Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>();

  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('tokens');
    if (stored) {
      try {
        return JSON.parse(stored)?.access_token || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(!token);

  // this is not safe but for now storing credentials in local storage
  const login = async (credentials: UserCredentials) => {
    const response = await api.post<Tokens>("auth/login", credentials);
    localStorage.setItem("tokens", JSON.stringify(response.data));
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tokens');
  };

  // On mount: restore token and fetch user if token exists



  const value: AuthContextType = {
    isAuthenticated: !!token && !!user,
    user,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}