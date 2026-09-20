import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { api } from '../api/axios';

// --- Types ---
export type User = {
  id: string;
  email: string;
  name?: string;
};

export type AuthContextType = {
  user: User | null;
  token: Tokens | null;
  loading: boolean;
  setToken: (token: Tokens) => void;
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
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState<Tokens | null>(() => {
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

  const getUser = async () => {
    try {
      const response = await api.get('auth/user')
      setUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const mountUser = async () => {
      if (token) {
        await getUser()
      }
      setLoading(false)
    }
    mountUser()
  }, [token])

  // this is not safe but for now storing credentials in local storage

  const value: AuthContextType = {
    user: user || null,
    token,
    loading,
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
