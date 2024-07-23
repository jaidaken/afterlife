// frontend/src/components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import getDiscordAvatarUrl from '../utils/getDiscordAvatarUrl';

const NavBar: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
      <ul className="flex space-x-6">
        <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
        {user && (
          <li><Link to="/dashboard" className="text-gray-300 hover:text-white">User Dashboard</Link></li>
        )}
        {user && user.isAdmin && (
          <li><Link to="/admin" className="text-gray-300 hover:text-white">Admin Dashboard</Link></li>
        )}
      </ul>
      <div className="auth-buttons flex items-center space-x-4">
        {user ? (
          <>
            <div className="avatar-wrapper">
              <img
                src={getDiscordAvatarUrl(user.discordId, user.avatar, user.discriminator)}
                alt={`${user.username}'s avatar`}
                className="rounded-full border-2 border-white p-1"
              />
              <span className="text-gray-300 hidden md:block">{`Welcome, ${user.username}`}</span>
            </div>
            <button
              onClick={logout}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Login with Discord
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
