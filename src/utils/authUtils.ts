import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { User } from '../models/User';

const url = import.meta.env.VITE_SERVER_URL;

export const fetchUser = async (setUser: Dispatch<SetStateAction<User | null>>) => {
  try {
    const response = await axios.get(`${url}/auth/me`, { withCredentials: true });
    setUser(response.data);
  } catch (error) {
    setUser(null);
  }
};

export const login = () => {
  window.location.href = `${url}/auth/discord`;
};

export const logout = async (setUser: Dispatch<SetStateAction<User | null>>) => {
  try {
    await axios.get(`${url}/auth/logout`, { withCredentials: true });
    setUser(null);
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error', error);
  }
};
