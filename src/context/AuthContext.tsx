// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchUser, login, logout } from '../utils/authUtils';

interface UserType {
  discordId: string;
  username: string;
  avatar: string;
  discriminator: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserType | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

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
