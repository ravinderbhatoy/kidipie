import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { api } from '../api/axios';

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

export const AuthContext = createContext<AuthContextType | null>(null);

// --- Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>();
  const [token, setToken] = useState<string | null>(() => {
    const storedTokens = localStorage.getItem("tokens");
    return storedTokens ? JSON.parse(storedTokens).access_token : null;
  }
  );
  const [loading, setLoading] = useState(true);

  // this is not safe but for now storing credentials in local storage
  const login = async (credentials: UserCredentials) => {
    try {
      const response = await api.post<Tokens>("auth/login", credentials);
      localStorage.setItem("tokens", JSON.stringify(response.data));
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tokens');
  };

  // On mount: restore token and fetch user if token exists
  useEffect(() => {
    const storedToken = (() => {
      const stored = localStorage.getItem('tokens');
      if (stored) {
        try {
          return JSON.parse(stored)?.access_token;
        } catch {
          return null;
        }
      }
      return null;
    })();
    if (storedToken) {
      setToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

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

// --- Custom hook for easy consumption ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
