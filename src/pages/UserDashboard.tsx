import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
	const [userCharacterNames, setUserCharacterNames] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (user) {
			const url = `/api/users/${user.discordId}`;
			// console.log(`Fetching user data from: ${url}`);
			axios.get(url)
				.then((response) => {
					// console.log('User data:', response.data);
					setUserCharacterNames(response.data.characters);
				})
				.catch((error) => {
					console.error('Error fetching user data:', error);
					if (error.response && error.response.status === 404) {
						setError('User not found.');
					} else {
						setError('An error occurred while fetching user data.');
					}
				});
		}
	}, [user]);

	useEffect(() => {
		if (userCharacterNames.length > 0) {
			axios.get('/api/characters')
				.then((response) => {
					// console.log('All characters:', response.data);
					const filteredCharacters = response.data.filter((character: Character) =>
						userCharacterNames.includes(character.charName)
					);
					setCharacters(filteredCharacters);
				})
				.catch((error) => {
					console.error('Error fetching characters:', error);
					setError('An error occurred while fetching characters.');
				});
		}
	}, [userCharacterNames]);

	if (!user) {
		return <h1 className="text-gray-300">Please log in to view your dashboard.</h1>;
	}

	return (
		<div className="flex justify-center min-h-screen">
			<div className="text-gray-300 p-4 text-center">
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
			</div>
		</div>
	);
};

export default UserDashboard;
