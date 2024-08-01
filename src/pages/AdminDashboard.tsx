import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { User } from '../models/User';
import { Character } from '../models/Character';
import CommandSender from '../components/CommandSender';
import { generateRandomPassword } from '../utils/password';
import Scrollbar from '../components/CustomScrollbar';

const getAvatarUrl = (charName: string): string => {
	return `/avatars/${charName}.webp` || '';
};

const AdminDashboard: React.FC = () => {
	const { user } = useAuth();

	const isAdmin = (user: User) => user && user.isAdmin;

	const [isCommandSenderModalOpen, setIsCommandSenderModalOpen] = useState(false);
	const [characterQueue, setCharacterQueue] = useState<any[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

	const handleImportCharacters = async () => {
		try {
			await axios.post('/api/import-characters');
			alert('Characters imported successfully');
		} catch (error) {
			console.error('Error importing characters', error);
			alert('Failed to import characters');
		}
	};

	const getUsernameByDiscordId = (discordId: string) => {
		const user = users.find((user) => user.discordId === discordId);
		return user ? user.username : 'Unknown';
	};

	useEffect(() => {
		axios.get('/api/character-queue').then((response) => {
			setCharacterQueue(response.data);
		}).catch((error) => {
			console.error('Error fetching character queue', error);
		});

		axios.get('/api/users').then((response) => {
			setUsers(response.data);
		}).catch((error) => {
			console.error('Error fetching users', error);
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
			const password = generateRandomPassword();
			const rconCommand = `adduser "${character.charName}" "${password}"`;
			await handleSendCommand(rconCommand);
			await axios.post(`/api/accept-character/${character.discordId}`, {
				password: password,
			});
			alert('Character accepted successfully');
			setSelectedCharacter(null);
			const response = await axios.get('/api/character-queue');
			setCharacterQueue(response.data);
		} catch (error) {
			console.error('Error accepting character:', error);
			alert('Failed to accept character');
		}
	};

	const handleOpenModal = (character: Character) => {
		setSelectedCharacter(character);
	};

	const handleCloseModal = () => {
		setSelectedCharacter(null);
	};

	if (!user) {
		return <h1 className="text-gray-300">Please log in to view the admin dashboard.</h1>;
	}

	if (!isAdmin(user)) {
		return <h1 className="text-gray-300">You do not have access to the admin dashboard.</h1>;
	}

	return (
		<Scrollbar>
			<div className="text-gray-300 flex items-center flex-col mt-10">
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

				{selectedCharacter && (
					<div className="fixed p-6 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<div className="bg-gray-800 text-gray-300 p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-full overflow-y-auto">
							<div className="flex flex-col items-center">
								<h2 className="text-2xl mb-4">{selectedCharacter.charName}</h2>
								<img
									src={getAvatarUrl(selectedCharacter.charName)}
									alt={`${selectedCharacter.charName}'s avatar`}
									className="w-64 h-64 mb-4"
								/>
							</div>
							<p className="text-center leading-7"><strong>Age</strong><br /> {selectedCharacter.age}</p>
							<p className="text-center leading-7"><strong>Birthplace</strong><br /> {selectedCharacter.birthplace}</p>
							<p className="text-center leading-7"><strong>Pronouns</strong><br /> {selectedCharacter.gender}</p>
							<p className="text-center leading-7"><strong>Appearance</strong><br /> {selectedCharacter.appearance}</p>
							<p className="text-center leading-7"><strong>Personality</strong><br /> {selectedCharacter.personality}</p>
							<p className="text-center leading-7"><strong>Backstory</strong><br /> {selectedCharacter.backstory}</p>
							<div className="flex justify-end mt-4">
								<button
									onClick={() => handleAcceptCharacter(selectedCharacter)}
									className="bg-green-500 text-white py-2 px-4 rounded mr-2"
								>
									Accept
								</button>
								<button
									onClick={handleCloseModal}
									className="bg-red-500 text-white py-2 px-4 rounded"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				<div className="mt-8 flex flex-col justify-center items-center pb-10 ">
					<h2 className="text-2xl mb-4">Character Queue</h2>
					<div className="w-full mx-auto">
						<ul>
							{characterQueue.map((character) => (
								<li key={character._id} className="mb-4 p-6 w-full bg-gray-800 rounded-lg shadow-lg">
									<div className="flex justify-between items-center gap-4">
										<div>
											<p className="text-center"><strong>Name:</strong> {character.charName}</p>
											<p className="text-center"><strong>Username:</strong> {getUsernameByDiscordId(character.discordId)}</p>
										</div>
										<button
											onClick={() => handleOpenModal(character)}
											className="bg-blue-500 text-white py-2 px-4 rounded"
										>
											View Details
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</Scrollbar>
	);
};

export default AdminDashboard;
