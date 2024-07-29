import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Character } from '../models/Character';

export interface CharacterContextProps { // Exporting CharacterContextProps
  characters: Character[];
  loading: boolean;
  fetchCharacters: () => void;
}

interface CharacterProviderProps {
  children: ReactNode;
}

export const CharacterContext = createContext<CharacterContextProps | undefined>(undefined);

export const CharacterProvider: React.FC<CharacterProviderProps> = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCharacters = async () => {
    try {
      const response = await axios.get('/api/characters');
      setCharacters(response.data);
    } catch (error) {
      console.error('Error fetching characters', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <CharacterContext.Provider value={{ characters, loading, fetchCharacters }}>
      {children}
    </CharacterContext.Provider>
  );
};
