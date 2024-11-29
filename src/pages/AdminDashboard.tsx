import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
	const [isGraveyardModalOpen, setIsGraveyardModalOpen] = useState(false);
	const [isCharacterQueueModalOpen, setIsCharacterQueueModalOpen] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [characterQueue, setCharacterQueue] = useState<any[]>([]);
	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
	const { getUsernameByDiscordId } = useUsers();
	const [graveyardCharacters, setGraveyardCharacters] = useState<Character[]>([]);

	useEffect(() => {
		if (user && user.role === 'user') {
			navigate('/dashboard');
		}
	}, [user, navigate]);

	const handleImportCharacters = async () => {
		try {
			const response = await fetch('/api/import-characters', {
				method: 'POST',
			});
			if (response.ok) {
				alert('Characters imported successfully');
			} else {
				console.error('Error importing characters:', response.statusText);
				alert('Failed to import characters');
			}
		} catch (error) {
			console.error('Error importing characters', error);
			alert('Failed to import characters');
		}
	};

	useEffect(() => {
		const fetchCharacterQueue = async () => {
			try {
				const response = await fetch('/api/character-queue');
				if (response.ok) {
					const data = await response.json();
					setCharacterQueue(data);
				} else {
					console.error('Error fetching character queue:', response.statusText);
				}
			} catch (error) {
				console.error('Error fetching character queue', error);
			}
		};

		fetchCharacterQueue();
	}, []);

	useEffect(() => {
		const fetchGraveyardCharacters = async () => {
			try {
				const response = await fetch('/api/graveyard');
				if (response.ok) {
					const data = await response.json();
					setGraveyardCharacters(data);
				} else {
					console.error('Error fetching graveyard characters:', response.statusText);
				}
			} catch (error) {
				console.error('Error fetching graveyard characters', error);
			}
		};

		fetchGraveyardCharacters();
	}, []);

	const handleRestoreCharacter = async (charName: string) => {
		try {
			const response = await fetch(`/api/restore-character/${charName}`, {
				method: 'POST',
			});
			if (response.ok) {
				alert('Character restored successfully');
				setGraveyardCharacters(graveyardCharacters.filter(char => char.charName !== charName));
			} else {
				console.error('Error restoring character:', response.statusText);
				alert('Failed to restore character');
			}
		} catch (error) {
			console.error('Error restoring character:', error);
			alert('Failed to restore character');
		}
	};

	const handleSendCommand = async (command: string) => {
		try {
			const response = await fetch('/api/zomboid/command', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ command }),
			});
			const data = await response.json();
			return data.output;
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
			const response = await fetch(`/api/accept-character/${character.discordId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password }),
			});
			if (response.ok) {
				alert('Character accepted successfully');
				setSelectedCharacter(null);
				const queueResponse = await fetch('/api/character-queue');
				if (queueResponse.ok) {
					const data = await queueResponse.json();
					setCharacterQueue(data);
				}
			} else {
				console.error('Error accepting character:', response.statusText);
				alert('Failed to accept character');
			}
		} catch (error) {
			console.error('Error accepting character', error);
			alert('Failed to accept character');
		}
	};

	const handleRejectCharacter = async (character: Character) => {
		const rejectionMessage = prompt('Enter rejection message:');
		if (!rejectionMessage) return;

		try {
			const response = await fetch(`/api/reject-character/${character.discordId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ rejectionMessage }),
			});
			if (response.ok) {
				alert('Character rejected successfully!');
				setSelectedCharacter(null);
				const queueResponse = await fetch('/api/character-queue');
				if (queueResponse.ok) {
					const data = await queueResponse.json();
					setCharacterQueue(data);
				}
			} else {
				console.error('Error rejecting character:', response.statusText);
				alert('There was an error rejecting the character.');
			}
		} catch (error) {
			console.error('Error rejecting character:', error);
			alert('There was an error rejecting the character.');
		}
	};

	const handleDeleteCharacter = async (character: Character) => {
		try {
			const response = await fetch(`/api/character-queue/${character.charName}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				alert('Character deleted successfully');
				setSelectedCharacter(null);
				const queueResponse = await fetch('/api/character-queue');
				if (queueResponse.ok) {
					const data = await queueResponse.json();
					setCharacterQueue(data);
				}
			} else {
				console.error('Error deleting character:', response.statusText);
				alert('Failed to delete character');
			}
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

	const handleOpenGraveyardModal = () => {
		setIsGraveyardModalOpen(true);
	};
	const handleCloseGraveyardModal = () => {
		setIsGraveyardModalOpen(false);
	};

	const handleOpenCharacterQueueModal = () => {
		setIsCharacterQueueModalOpen(true);
	};

	const handleCloseCharacterQueueModal = () => {
		setIsCharacterQueueModalOpen(false);
	};

	return (
		<Scrollbar>
			<div className="text-gray-300 flex items-center flex-col mt-10">
				<div className="flex justify-center items-center flex-col">
					<h1 className="text-3xl font-bold mb-4">{getDashboardTitle(user)}</h1>

					{(isAdmin(user) || isModerator(user)) && (
						<div className="flex flex-col gap-4">
							<button
								onClick={handleImportCharacters}
								className="bg-green-500 text-white py-2 px-4 rounded w-72"
							>
								Import Characters
							</button>

							{isAdmin(user) && (
								<button
									onClick={() => setIsCommandSenderModalOpen(true)}
									className="bg-purple-500 text-white py-2 px-4 rounded w-72"
								>
									Open Command Sender
								</button>
							)}
						</div>
					)}
				</div>

				{(isAdmin(user) || isModerator(user) || isApplicationTeam(user)) && (
						<div className='flex flex-col gap-4 mt-4'>
							<button
								onClick={handleOpenCharacterQueueModal}
								className="bg-blue-700 text-white py-2 px-4 rounded w-72"
							>
								Show Character Queue
								<span className={characterQueue.length !== 0 ? 'text-red-500 font-bold' : ''}>
									{' '}({characterQueue.length})
								</span>
							</button>

							<button
								onClick={handleOpenGraveyardModal}
								className="bg-red-500 text-white py-2 px-4 rounded w-72"
							>
								Show Graveyard Characters
							</button>
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
									{(isAdmin(user) || isModerator(user) || isApplicationTeam(user)) && (
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
									)}
								</div>
							</Scrollbar>
						</div>
					</div>
				)}


				{isCharacterQueueModalOpen && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
						<div className="bg-gray-700 p-6 rounded-lg shadow-lg w-3/4 max-w-3xl">
							<div className="flex flex-col justify-center items-center">
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
								<button
									onClick={handleCloseCharacterQueueModal}
									className="bg-red-500 text-white py-2 px-4 rounded mt-4"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				{isGraveyardModalOpen && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
						<div className="bg-gray-700 p-6 rounded-lg shadow-lg w-3/4 max-w-3xl">
							<div className="flex flex-col justify-center items-center ">
								<h2 className="text-2xl mb-4">Graveyard Characters</h2>
								<div className="w-full mx-auto max-h-96 overflow-y-auto">
									<ul>
										{graveyardCharacters.map((character) => (
											<li key={character._id?.toString()} className="mb-4 p-6 w-full bg-gray-800 rounded-lg shadow-lg">
												<div className="flex justify-between items-center gap-4">
													<div>
														<p className="text-center"><strong>Name:</strong> {character.charName}</p>
													</div>
													{(isAdmin(user) || isModerator(user)) && (
														<button
															onClick={() => handleRestoreCharacter(character.charName)}
															className="bg-green-500 text-white py-2 px-4 rounded"
														>
															Restore
														</button>
													)}
												</div>
											</li>
										))}
									</ul>
								</div>
								<button
									onClick={handleCloseGraveyardModal}
									className="bg-red-500 text-white py-2 px-4 rounded mt-4"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

			</div>
		</Scrollbar>
	);
};

export default AdminDashboard;
