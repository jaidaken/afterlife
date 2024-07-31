import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Character } from '../models/Character';

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
    return <div className="p-4"></div>;
  }

  return (
    <div className="flex justify-center mt-6">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4 flex justify-center">Characters</h1>
        {characters.length === 0 ? (
          <p>No characters found.</p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center flex-grow flex-shrink">
            {characters.map((character, index) => (
              <div
                key={index}
                className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition"
              >
                <Link to={`/character/${character.charName}`}>
                  <div className="flex flex-col items-center">
                    <img
                      src={getAvatarUrl(character.charName)}
                      alt={`${character.charName}'s avatar`}
                      className="w-48 h-48 rounded-lg mb-2 object-cover"
                    />
                    <h2 className="text-xl text-white">{character.charName}</h2>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharactersList;
