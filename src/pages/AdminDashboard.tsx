import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { User } from '../models/User';
import { Character } from '../models/Character';
import CommandSender from '../components/CommandSender';
import { generateRandomPassword } from '../utils/password';
import Scrollbar from '../components/CustomScrollbar';
import useUsers from '../utils/getUsernameByDiscordId'; // Import the function


const getAvatarUrl = (charName: string): string => {
	return `/avatars/${charName}.webp` || '';
};



const AdminDashboard: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const isAdmin = (user: User) => user && user.role === 'admin';
	const isModerator = (user: User) => user && user.role === 'moderator';
	const isApplicationTeam = (user: User) => user && user.role === 'applicationTeam';

	const [isCommandSenderModalOpen, setIsCommandSenderModalOpen] = useState(false);
	const [characterQueue, setCharacterQueue] = useState<any[]>([]);
	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
	const { getUsernameByDiscordId } = useUsers();

	useEffect(() => {
		if (user && user.role === 'user') {
			navigate('/dashboard');
		}
	}, [user, navigate]);

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

	const handleRejectCharacter = async (character: Character) => {
		const rejectionMessage = prompt('Enter rejection message:');
		if (!rejectionMessage) return;

		try {
			await axios.post(`/api/reject-character/${character.discordId}`, { rejectionMessage }, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			alert('Character rejected successfully!');
			setSelectedCharacter(null);
			const response = await axios.get('/api/character-queue');
			setCharacterQueue(response.data);
		} catch (error) {
			console.error('Error rejecting character:', error);
			alert('There was an error rejecting the character.');
		}
	};

	const handleDeleteCharacter = async (character: Character) => {
		try {
			await axios.delete(`/api/character-queue/${character.charName}`);
			alert('Character deleted successfully');
			setSelectedCharacter(null);
			const response = await axios.get('/api/character-queue');
			setCharacterQueue(response.data);
		} catch (error) {
			console.error('Error deleting character:', error);
			alert('Failed to delete character');
		}
	};

	const getDashboardTitle = (user: User) => {
		if (isAdmin(user)) return 'Admin Dashboard';
		if (isModerator(user)) return 'Moderator Dashboard';
		if (isApplicationTeam(user)) return 'Application Team Dashboard';
		return 'Dashboard';
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

	if (!isAdmin(user) && !isModerator(user) && !isApplicationTeam(user)) {
		return <h1 className="text-gray-300">You do not have access to the admin dashboard.</h1>;
	}

	return (
		<Scrollbar>
			<div className="text-gray-300 flex items-center flex-col mt-10">
				<div className="flex justify-center items-center flex-col">
					<h1 className="text-3xl font-bold mb-4">{getDashboardTitle(user)}</h1>

					{(isAdmin(user) || isModerator(user)) && (
						<div className="flex flex-col gap-4">
							<button
								onClick={handleImportCharacters}
								className="bg-green-500 text-white py-2 px-4 rounded"
							>
								Import Characters
							</button>

							{isAdmin(user) && (
								<button
									onClick={() => setIsCommandSenderModalOpen(true)}
									className="bg-purple-500 text-white py-2 px-4 rounded"
								>
									Open Command Sender
								</button>
							)}
						</div>
					)}
				</div>

				{(isAdmin(user) || isModerator(user) || isApplicationTeam(user)) && (
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

				{selectedCharacter && (
					<div className="fixed p-6 inset-0 bg-black bg-opacity-50 flex items-center justify-center pt-24 pb-32">
						<div className="bg-gray-800 text-gray-300 rounded-lg shadow-lg w-full max-w-3/4 max-h-full h-screen overflow-y-auto">
							<Scrollbar>
								<div className='p-8 flex flex-col'>
									<div className="tester flex flex-col items-center">
										<h2 className="text-2xl mb-4">{selectedCharacter.charName}</h2>
										<img
											src={getAvatarUrl(selectedCharacter.charName)}
											alt={`${selectedCharacter.charName}'s avatar`}
											className="w-64 h-64 mb-4"
										/>
										{selectedCharacter.rejectionMessage && (
											<>
												<h3 className="text-1xl text-red-500">Previous Rejection reason:</h3>
												<h3 className="text-1xl text-red-500 pb-4">{selectedCharacter.rejectionMessage}</h3>
											</>
										)}
									</div>
									<p className="text-center leading-7 break-words whitespace-normal"><strong>Age</strong><br /> {selectedCharacter.age}</p>
									<p className="text-center leading-7 break-words whitespace-normal"><strong>Birthplace</strong><br /> {selectedCharacter.birthplace}</p>
									<p className="text-center leading-7 break-words whitespace-normal"><strong>Pronouns</strong><br /> {selectedCharacter.gender}</p>
									<p className="text-center leading-7 break-words whitespace-normal"><strong>Appearance</strong><br /> {selectedCharacter.appearance}</p>
									<p className="text-center leading-7 break-words whitespace-normal"><strong>Personality</strong><br /> {selectedCharacter.personality}</p>
									<p className="text-center leading-7 break-words whitespace-normal"><strong>Backstory</strong><br /> {selectedCharacter.backstory}</p>
									<div className="flex mx-auto mt-4 gap-2">
										<button
											onClick={() => handleAcceptCharacter(selectedCharacter)}
											className="bg-green-500 text-white py-2 px-4 rounded"
										>
											Accept
										</button>
										<button
											onClick={() => handleRejectCharacter(selectedCharacter)}
											className="bg-red-500 text-white py-2 px-4 rounded"
										>
											Reject
										</button>
										<button onClick={() => handleDeleteCharacter(selectedCharacter)} className="bg-red-900 text-white py-2 px-4 rounded">Delete</button>
										<button
											onClick={handleCloseModal}
											className="bg-blue-500 text-white py-2 px-4 rounded"
										>
											Close
										</button>
									</div>
								</div>
							</Scrollbar>
						</div>
					</div>
				)}


			</div>
		</Scrollbar>
	);
};

export default AdminDashboard;
