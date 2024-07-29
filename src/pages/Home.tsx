import React, { useEffect } from 'react';
import { useCharacters } from '../hooks/useCharacters';

const Home: React.FC = () => {
  const { fetchCharacters } = useCharacters();

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return (
    <div className="text-center my-8 text-gray-300">
      <h1 className="text-4xl font-bold mb-4">Welcome to MyApp</h1>
      <p className="text-xl">This is the home page.</p>
    </div>
  );
};

export default Home;
