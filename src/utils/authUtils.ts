import { Dispatch, SetStateAction } from 'react';
import { User } from '../models/User';

const url = import.meta.env.VITE_HOST_URL;

export const fetchUser = async (setUser: Dispatch<SetStateAction<User | null>>) => {
  try {
    const response = await fetch(`${url}/auth/me`, {
      credentials: 'include',
    });
    if (response.ok) {
      const data: User = await response.json();
      setUser(data);
    } else {
      setUser(null);
    }
  } catch (error) {
    setUser(null);
  }
};

export const login = () => {
  window.location.href = `${url}/auth/discord`;
};

export const logout = async (setUser: Dispatch<SetStateAction<User | null>>) => {
  try {
    const response = await fetch(`${url}/auth/logout`, {
      credentials: 'include',
    });
    if (response.ok) {
      setUser(null);
      window.location.href = '/';
    } else {
      console.error('Logout error', response.statusText);
    }
  } catch (error) {
    console.error('Logout error', error);
  }
};
