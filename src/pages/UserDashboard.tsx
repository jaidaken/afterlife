import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Character {
  username: string;
  steamID: string;
  charName: string;
  profession: string;
  isAlive: boolean;
  zombieKills: number;
  survivorKills: number;
  hoursSurvived: number;
  userId?: string; // Add userId field
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    if (user) {
      axios.get(`/api/characters?userId=${user.discordId}`).then((response) => {
        setCharacters(response.data);
      });
    }
  }, [user]);

  if (!user) {
    return <h1 className="text-gray-300">Please log in to view your dashboard.</h1>;
  }

  return (
    <div className="text-gray-300">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <p>This is the user dashboard, visible only to logged-in users.</p>
      <div>
        <h2 className="text-2xl mt-4 mb-2">Your Characters</h2>
        {characters.length > 0 ? (
          <ul>
            {characters.map((character) => (
              <li key={character.id} className="mb-2">
                <Link to={`/character/edit/${character.id}`} className="text-blue-500">
                  {character.charName} - {character.profession}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no characters.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
