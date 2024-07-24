import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { User } from '../context/AuthContext';

export const fetchUser = async (setUser: Dispatch<SetStateAction<User | null>>) => {
  try {
    const response = await axios.get('http://localhost:3000/auth/me', { withCredentials: true });
    setUser(response.data);
  } catch (error) {
    setUser(null);
  }
};

export const login = () => {
  window.location.href = 'http://localhost:3000/auth/discord';
};

export const logout = async (setUser: Dispatch<SetStateAction<User | null>>) => {
  try {
    await axios.get('http://localhost:3000/auth/logout', { withCredentials: true });
    setUser(null);
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error', error);
  }
};
