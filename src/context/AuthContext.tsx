import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchUser, login, logout } from '../utils/authUtils';

export interface User {
	discordId: string;
	username: string;
	avatar: string;
	isAdmin: boolean;
	characters: string[];
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
