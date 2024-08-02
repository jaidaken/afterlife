import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import Scrollbar from '../components/CustomScrollbar';
import { Character } from '../models/Character';
import { User } from '../models/User';

interface RejectedCharacter {
	charName: String,
	discordId: String,
	age: Number,
	birthplace: String,
	gender: String,
	appearance: String,
	personality: String,
	backstory: String,
	rejectionMessage: String,
}

const getAvatarUrl = (charName: string): string => {
	return `/avatars/${charName}.webp`;
};

const UserDashboard: React.FC = () => {
	const { user } = useAuth() as { user: User | null };
	const [characters, setCharacters] = useState<Character[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [rejectedCharacters, setRejectedCharacters] = useState<RejectedCharacter[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			const url = `/api/characters/user/${user.discordId}`;
			axios.get(url)
				.then((response) => {
					setCharacters(response.data);
				})
				.catch((error) => {
					console.error('Error fetching characters:', error);
					if (error.response && error.response.status === 404) {
						setError('No characters found for this user.');
					} else {
						setError('An error occurred while fetching characters.');
					}
				});
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			const fetchRejectedCharacters = async () => {
				try {
					const response = await axios.get(`/api/rejected-characters/${user?.discordId}`);
					setRejectedCharacters(response.data);
				} catch (error) {
					console.error('Error fetching rejected characters:', error);
				}
			};

			fetchRejectedCharacters();
		}
	}, [user]);

	const handleResubmitCharacter = (character: RejectedCharacter) => {
		navigate('/resubmit-character', { state: { character } });
	};

	if (!user) {
		return <h1 className="text-gray-300">Please log in to view your dashboard.</h1>;
	}

	return (
		<Scrollbar>
			<div className="text-gray-300 flex items-center flex-col flex-grow-1 mt-10">
				<div className="flex justify-center items-center flex-col">
					<h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
					<p>This is the user dashboard, visible only to logged-in users.</p>
					{error && <p className="text-red-500">{error}</p>}
					<div className='mt-4'>
						<h2 className="text-2xl mb-4 text-white flex justify-center">Your Characters</h2>
						{characters.length > 0 ? (
							<div className="flex flex-wrap gap-4 justify-center flex-grow flex-shrink">
								{characters.map((character) => (
									<Link key={String(character.discordId)} to={`/character/${character.charName}`} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition">
										<div className="flex flex-col items-center">
											<img
												src={getAvatarUrl(character.charName)}
												alt={`${character.charName}'s avatar`}
												className="w-48 h-48 rounded-lg mb-2 object-cover"
											/>
											<h2 className="text-xl text-white">{character.charName}</h2>
											<p className="text-sm text-gray-400">{character.profession}</p>
										</div>
									</Link>
								))}
							</div>
						) : (
							<p>You have no characters.</p>
						)}
					</div>
					<div className="my-8">
						<Link to="/create-character" className="bg-blue-500 text-white py-2 px-4 rounded">
							Create New Character
						</Link>
					</div>

					<div className="w-auto mx-auto">
					<h2 className="text-2xl mb-4 text-white flex justify-center">Rejected Characters</h2>
						<ul>
							{rejectedCharacters.map((character) => (
								<li key={String(character.discordId)} className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg">
									<div className="flex justify-center items-center gap-6">
										<div>
											<p className="text-center"><strong>Name:</strong> {character.charName}</p>
											<p className="text-center"><strong>Rejection Reason:</strong> {character.rejectionMessage}</p>
										</div>
										<button
											onClick={() => handleResubmitCharacter(character)}
											className="bg-blue-500 text-white py-1 px-2 rounded"
										>
											Resubmit
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

export default UserDashboard;
