import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../models/Character';
import Scrollbar from '../components/CustomScrollbar';

const getAvatarUrl = (charName: string): string => {
	return `/avatars/${charName}.webp`;
};

const CharactersList: React.FC = () => {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
				try {
						const response = await fetch('/api/characters');
						if (response.ok) {
								const data = await response.json();
								if (Array.isArray(data)) {
										setCharacters(data);
								} else {
										console.error('Unexpected response format:', data);
								}
						} else {
								console.error('Error fetching characters:', response.statusText);
						}
				} catch (error) {
						console.error('Error fetching characters', error);
				} finally {
						setLoading(false);
				}
		};

		fetchData();
}, []);

if (loading) {
		return <div className="p-4"></div>;
}

	return (
		<Scrollbar>
			<div className="flex justify-center mt-4 mb-14">
				<div className="p-4 w-3/4">
					<h1 className="text-3xl font-bold mb-4 flex justify-center">Characters</h1>
					{characters.length === 0 ? (
						<p>No characters found.</p>
					) : (
						<div className="flex flex-wrap gap-4 justify-center flex-grow flex-shrink">
							{characters.map((character, index) => (
								<div
									key={index}
									className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition"
								>
									<Link to={`/character/${character.charName}`}>
										<div className="flex flex-col items-center">
											<img
												src={getAvatarUrl(character.charName)}
												alt={`${character.charName}'s avatar`}
												className="w-48 h-48 rounded-lg mb-2 object-cover"
											/>
											<h2 className="text-xl text-white">{character.charName}</h2>
										</div>
									</Link>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</Scrollbar>
	);
};

export default CharactersList;
