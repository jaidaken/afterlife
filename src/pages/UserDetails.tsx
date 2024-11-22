import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User } from '../models/User';
import { Character } from '../models/Character';
import UserAvatar from '../components/UserAvatar';

const UserDetail: React.FC = () => {
	const { discordId } = useParams<{ discordId: string }>();
	const [user, setUser] = useState<User | null>(null);
	const [characters, setCharacters] = useState<Character[]>([]);

	useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await fetch(`/api/users/${discordId}`);
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                console.error('Error fetching user:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user', error);
        }
    };

    const fetchCharacters = async () => {
        try {
            const response = await fetch(`/api/characters/user/${discordId}`);
            if (response.ok) {
                const data = await response.json();
                setCharacters(data);
            } else {
                console.error('Error fetching characters:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching characters', error);
        }
    };

    fetchUser();
    fetchCharacters();
	}, [discordId]);
	
	if (!user) {
		return <h1 className="text-gray-300">Loading...</h1>;
	}

	return (
		<div className="text-gray-300 flex items-center flex-col flex-grow-1 mt-10">
			<h1 className="text-3xl font-bold mb-4">{user.username.split('#')[0]}'s Profile</h1>
			<div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg mb-6">
				<UserAvatar
					userId={user.discordId}
					avatarHash={user.avatar}
					className="w-24 h-24 mb-2 mx-auto" // Added mx-auto to center the avatar
					discriminator={user.username.split('#')[1]}
				/>
				<h2 className="text-xl text-white">{user.username.split('#')[0]}</h2>
				<p className="text-sm text-gray-400">{`Discord ID: ${user.discordId}`}</p>
			</div>
			<h1 className="text-3xl font-bold mb-4">{user.username.split('#')[0]}'s Characters</h1>
			<div className="flex flex-wrap gap-4 justify-center flex-grow flex-shrink">
				{characters.map((character) => (
					<Link to={`/character/${character.charName}`} key={character.discordId} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg justify-center text-center transition">
						<img
							src={`/avatars/${character.charName}.webp`}
							alt={`${character.charName}'s avatar`}
							className="w-32 h-32 mx-auto mb-4 object-cover"
						/>
						<h2 className="text-xl text-white">{character.charName}</h2>
						<p className="text-sm text-gray-400">{character.profession}</p>
					</Link>
				))}
			</div>
		</div>
	);
};

export default UserDetail;
