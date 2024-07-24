import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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

const getAvatarUrl = (charName: string): string => {
  return `/avatars/${charName}.webp`;
};

const CharacterDetail: React.FC = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/characters/${name}`);
        setCharacter(response.data);
      } catch (error) {
        console.error('Error fetching character data', error);
      }
    };

    fetchData();
  }, [name]);

  const handleEdit = () => {
    navigate(`/character/edit/${character?.id}`);
  };

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{character.charName}</h1>
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <img
          src={getAvatarUrl(character.charName)}
          alt={`${character.charName}'s avatar`}
          className="w-32 h-32 mx-auto rounded-full mb-4"
        />
        <p className="text-lg text-white">{character.profession}</p>
        <p className={`text-sm ${character.isAlive ? 'text-green-500' : 'text-red-500'}`}>
          {character.isAlive ? 'Alive' : 'Dead'}
        </p>
        <p className="text-gray-400">Zombie Kills: {character.zombieKills}</p>
        <p className="text-gray-400">Survivor Kills: {character.survivorKills}</p>
        <p className="text-gray-400">Hours Survived: {character.hoursSurvived}</p>
        {character.userId === user?.discordId && (
          <button onClick={handleEdit} className="bg-blue-500 text-white mt-4 py-2 px-4 rounded">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterDetail;
