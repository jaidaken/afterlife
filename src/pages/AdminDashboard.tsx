import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User } from '../context/AuthContext';


const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  interface Character {
		charName: string;
		profession: string;
		username: string;
		steamID: string;
		isAlive: boolean;
		zombieKills: number;
		survivorKills: number;
		hoursSurvived: number;
  }

	const isAdmin = (user: User) => user && user.isAdmin;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch all characters
    axios.get('/api/characters').then((response) => {
      setCharacters(response.data);
    });

    // Fetch all users
    axios.get('/api/users')
      .then((response) => {
        console.log('Fetched users:', response.data);
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
      setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error('Error assigning character', error);
      alert('Failed to assign character');
    }
  };

  if (!user) {
    return <h1 className="text-gray-300">Please log in to view the admin dashboard.</h1>;
  }

  if (!isAdmin(user)) {
    return <h1 className="text-gray-300">You do not have access to the admin dashboard.</h1>;
  }

  return (
    <div className="text-gray-300">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>This is the admin dashboard, visible only to admin users.</p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        Assign Character
      </button>

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
    </div>
  );
};

export default AdminDashboard;
