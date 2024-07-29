import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { fetchUser, login, logout } from '../utils/authUtils';

export interface User {
	discordId: string;
	username: string;
	avatar: string;
	isAdmin: boolean;
	characters: string[];
}

export interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout: () => logout(setUser) }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
