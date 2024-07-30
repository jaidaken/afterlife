import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { User } from '../models/User';
import { Character } from '../models/Character';
import CommandSender from '../components/CommandSender';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const isAdmin = (user: User) => user && user.isAdmin;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCommandSenderModalOpen, setIsCommandSenderModalOpen] = useState(false);

  const handleImportCharacters = async () => {
    try {
      await axios.post('/api/import-characters');
      alert('Characters imported successfully');
    } catch (error) {
      console.error('Error importing characters', error);
      alert('Failed to import characters');
    }
  };

  useEffect(() => {
    axios.get('/api/characters').then((response) => {
      setCharacters(response.data);
    });

    axios.get('/api/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/api/characters/${selectedCharacter}/assign`, {
        discordId: selectedUser,
      });
      alert('Character assigned successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error assigning character', error);
      alert('Failed to assign character');
    }
  };

	const handleSendCommand = async (command: string) => {
    try {
      const response = await axios.post('/api/zomboid/command', { command });
      return response.data.output;
    } catch (error) {
      console.error('Error sending command', error);
      return 'Failed to send command';
    }
	};

  if (!user) {
    return <h1 className="text-gray-300">Please log in to view the admin dashboard.</h1>;
  }

  if (!isAdmin(user)) {
    return <h1 className="text-gray-300">You do not have access to the admin dashboard.</h1>;
  }

  return (
    <div className="text-gray-300 flex items-center flex-col">
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-4">This is the admin dashboard, visible only to admin users.</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Assign Character
          </button>

          <button
            onClick={handleImportCharacters}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Import Characters
          </button>

          <button
            onClick={() => setIsCommandSenderModalOpen(true)}
            className="bg-purple-500 text-white py-2 px-4 rounded"
          >
            Open Command Sender
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Assign Character</h2>
            <form onSubmit={handleAssign}>
              <div className="mb-4">
                <label htmlFor="character" className="block text-white">Select Character:</label>
                <select
                  id="character"
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  <option value="">--Select Character--</option>
                  {characters.map((character) => (
                    <option key={character.charName} value={character.charName}>
                      {character.charName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="user" className="block text-white">Select User:</label>
                <select
                  id="user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  <option value="">--Select User--</option>
                  {users.map((user) => (
                    <option key={user.discordId} value={user.discordId}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCommandSenderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Command Sender</h2>
            <CommandSender onSendCommand={handleSendCommand} />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsCommandSenderModalOpen(false)}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
