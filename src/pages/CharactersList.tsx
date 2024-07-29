import React from 'react';
import { Link } from 'react-router-dom';
import { useCharacters } from '../hooks/useCharacters';

const getAvatarUrl = (charName: string): string => {
  return `/avatars/${charName}.webp`;
};

const CharactersList: React.FC = () => {
  const { characters, loading } = useCharacters();

  if (loading) {
    return <div className="p-4"></div>;
  }

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <h1 className="text-2xl mb-4 text-white flex justify-center">Characters</h1>
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
