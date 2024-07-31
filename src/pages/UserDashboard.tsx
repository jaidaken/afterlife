import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

interface Character {
	_id: string;
	charName: string;
	profession: string;
	isAlive: boolean;
	zombieKills: number;
	survivorKills: number;
	hoursSurvived: number;
}

const getAvatarUrl = (charName: string): string => {
	return `/avatars/${charName}.webp`;
};

const UserDashboard: React.FC = () => {
	const { user } = useAuth();
	const [characters, setCharacters] = useState<Character[]>([]);
	const [error, setError] = useState<string | null>(null);

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

	if (!user) {
			return <h1 className="text-gray-300">Please log in to view your dashboard.</h1>;
	}

	return (
			<div className="text-gray-300 flex items-center flex-col mt-10">
					<div className="flex justify-center items-center flex-col">
							<h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
							<p>This is the user dashboard, visible only to logged-in users.</p>
							{error && <p className="text-red-500">{error}</p>}
							<div className='mt-4'>
									<h2 className="text-2xl mb-4 text-white flex justify-center">Your Characters</h2>
									{characters.length > 0 ? (
											<div className="flex flex-wrap gap-4 justify-center flex-grow flex-shrink">
													{characters.map((character) => (
															<Link key={character._id} to={`/character/${character.charName}`} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition">
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
							<div className="mt-4">
									<Link to="/create-character" className="bg-blue-500 text-white py-2 px-4 rounded">
											Create New Character
									</Link>
							</div>
					</div>
			</div>
	);
};

export default UserDashboard;
