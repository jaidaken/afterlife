import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { fetchUser, login, logout } from '../utils/authUtils';
import { User } from '../models/User';


export interface AuthContextProps {
  user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
	});

	useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout: () => logout(setUser) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;

