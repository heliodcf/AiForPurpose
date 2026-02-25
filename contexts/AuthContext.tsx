import React, { createContext, useState, useEffect, useContext } from 'react';
import { AdminUser } from '../types';
import { db } from '../services/db';
import { useRouter } from './RouterContext';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { navigate } = useRouter();

  useEffect(() => {
    db.getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch((err) => {
        console.error("Erro ao verificar sessão do Supabase:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (userData: AdminUser) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await db.logout();
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    navigate('#/admin'); // Redireciona para o login de forma segura
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};