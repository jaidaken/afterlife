import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Character {
  id: string;
  charName: string;
  profession: string;
  isAlive: boolean;
  zombieKills: number;
  survivorKills: number;
  hoursSurvived: number;
  userId?: string;
}

const getAvatarUrl = (charName: string): string => {
  return `/avatars/${charName}.webp`;
};

const CharactersList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/characters');
        if (response.data && Array.isArray(response.data)) {
          setCharacters(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching characters', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 text-white">Characters</h1>
      {characters.length === 0 ? (
        <p>No characters found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {characters.map((character, index) => (
            <div key={index} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition">
              <Link to={`/character/${character.charName}`}>
                <div className="flex flex-col items-center">
                  <img
                    src={getAvatarUrl(character.charName)}
                    alt={`${character.charName}'s avatar`}
                    className="w-32 h-32 rounded-full mb-2 object-cover"
                  />
                  <h2 className="text-xl text-white">{character.charName}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharactersList;
