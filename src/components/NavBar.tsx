import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import getDiscordAvatarUrl from '../utils/getDiscordAvatarUrl';

const NavBar: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="sticky top-0 left-0 w-full bg-gray-800 text-white p-2 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-semibold text-white">
            AfterLife RP
          </Link>
          <Link to="/characters" className="text-gray-300 hover:text-white transition">
            Characters
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition">
                User Dashboard
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="text-gray-300 hover:text-white transition">
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="avatar-wrapper">
                <img
                  src={getDiscordAvatarUrl(user.discordId, user.avatar)}
                  alt={`${user.username}'s avatar`}
                  className="rounded-full border-2 border-white w-10 h-10"
                />
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
      </div>
    </nav>
  );
};

export default NavBar;
