import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchUser } from '../utils/authUtils';
import { User } from '../models/User';

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUser(setUser).finally(() => setLoading(false));
  }, []);

  const login = () => {
    // login logic
  };

  const logout = () => {
    // logout logic
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
