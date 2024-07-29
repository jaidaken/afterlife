import { useContext } from 'react';
import { CharacterContext, CharacterContextProps } from '../context/CharacterContext';

export const useCharacters = (): CharacterContextProps => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacters must be used within a CharacterProvider');
  }
  return context;
};
