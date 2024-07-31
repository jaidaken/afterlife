import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { User } from '../models/User';
import { Character } from '../models/Character';
import CommandSender from '../components/CommandSender';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();

    const isAdmin = (user: User) => user && user.isAdmin;

    const [isCommandSenderModalOpen, setIsCommandSenderModalOpen] = useState(false);
    const [characterQueue, setCharacterQueue] = useState<any[]>([]);

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
        axios.get('/api/character-queue').then((response) => {
            setCharacterQueue(response.data);
        }).catch((error) => {
            console.error('Error fetching character queue', error);
        });
    }, []);

    const handleSendCommand = async (command: string) => {
        try {
            const response = await axios.post('/api/zomboid/command', { command });
            return response.data.output;
        } catch (error) {
            console.error('Error sending command', error);
            return 'Failed to send command';
        }
    };

    const handleAcceptCharacter = async (character: Character) => {
        try {
            await axios.post(`/api/accept-character/${character.discordId}`, character);
            alert('Character accepted successfully');
            setCharacterQueue(characterQueue.filter((item) => item._id !== character._id));
        } catch (error) {
            console.error('Error accepting character', error);
            alert('Failed to accept character');
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

            <div className="mt-8">
                <h2 className="text-2xl mb-4">Character Queue</h2>
                <ul>
                    {characterQueue.map((character) => (
                        <li key={character._id} className="mb-4">
                            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                                <p><strong>Name:</strong> {character.name}</p>
                                <p><strong>Appearance:</strong> {character.appearance}</p>
                                <p><strong>Personality:</strong> {character.personality}</p>
                                <p><strong>Alignment:</strong> {character.alignment}</p>
                                <button
                                    onClick={() => handleAcceptCharacter(character)}
                                    className="bg-green-500 text-white py-2 px-4 rounded mt-2"
                                >
                                    Accept
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
