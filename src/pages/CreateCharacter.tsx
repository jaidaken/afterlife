import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { Character } from '../models/Character';

const CreateCharacter: React.FC = () => {
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character>({
    charName: '',
    appearance: '',
    personality: '',
    alignment: '',
    profession: '',
    discordId: user?.discordId || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!character.charName || !user?.discordId) {
      alert('Character name and Discord ID are required');
      return;
    }
    try {
      const payload = { ...character, discordId: user?.discordId };
      console.log('Submitting character:', payload); // Log the payload
      const response = await axios.post('/api/character-queue', payload);
      console.log('Response:', response);
      alert('Character submitted successfully');
    } catch (error) {
      console.error('Error submitting character', error);
      alert('Failed to submit character');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Create Character</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white">Character Name</label>
          <input
            type="text"
            name="charName"
            value={character.charName}
            onChange={handleChange}
            className="w-full p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Appearance</label>
          <input
            type="text"
            name="appearance"
            value={character.appearance}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Personality</label>
          <input
            type="text"
            name="personality"
            value={character.personality}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Alignment</label>
          <input
            type="text"
            name="alignment"
            value={character.alignment}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default CreateCharacter;
