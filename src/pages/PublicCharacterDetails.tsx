import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Scrollbar from '../components/CustomScrollbar';
import { Character } from '../models/Character';
import SkillLevel from '../components/SkillLevel';
import useUsers from '../utils/getUsernameByDiscordId';

const getAvatarUrl = (charName: string): string => {
	return `/avatars/${charName}.webp` || '';
};

const PublicCharacterDetails: React.FC = () => {
	const { name } = useParams();
	const [character, setCharacter] = useState<Character | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const { getUsernameByDiscordId } = useUsers();

	useEffect(() => {
			const fetchData = async () => {
					try {
							const response = await axios.get(`/api/characters/${name}`);
							setCharacter(response.data);
							// Fetch the username by discordId
							const fetchedUsername = getUsernameByDiscordId(response.data.discordId);
							setUsername(fetchedUsername);
					} catch (error) {
							console.error('Error fetching character data', error);
					}
			};

			fetchData();
	}, [name, getUsernameByDiscordId]);
	if (!character) {
		return <div></div>;
	}

	return (
		<Scrollbar>
			<div className="p-4 flex items-center flex-col mt-10">
				<div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg">
					<h1 className="text-3xl font-bold mb-4">{character.charName}</h1>
					{username && <p className="text-xl text-gray-400 mb-4">User: {username}</p>} {/* Display the username */}
					<img
						src={getAvatarUrl(character.charName)}
						alt={`${character.charName}'s avatar`}
						className="w-96 h-96 mx-auto mb-4 object-cover"
					/>
					<p className={`text-2xl ${character.isAlive ? 'text-green-500' : 'text-red-500'}`}>
						{character.isAlive ? 'Alive' : 'Dead'}
					</p>
					<div className="text-center mt-4 flex flex-col justify-center items-center">
						<h2 className="text-xl text-white mb-2">Skills</h2>
						<table className="text-gray-400 mb-2 flex justify-center items-center">
							<tbody className='flex gap-4'>
								<tr className='flex flex-col'>
									<th className='text-2xl'>Physical </th>
									<td>Fitness <SkillLevel level={character.Fitness ?? 0} /></td>
									<td>Strength <SkillLevel level={character.Strength ?? 0} /></td>
									<td>Sprinting <SkillLevel level={character.Sprinting ?? 0} /></td>
									<td>Lightfooted <SkillLevel level={character.Lightfooted ?? 0} /></td>
									<td>Nimble <SkillLevel level={character.Nimble ?? 0} /></td>
									<td>Sneaking <SkillLevel level={character.Sneaking ?? 0} /></td>
								</tr>
								<tr className='flex flex-col'>
									<td className='text-2xl'>Combat </td>
									<td >Axe <SkillLevel level={character.Axe ?? 0} /></td>
									<td>LongBlunt <SkillLevel level={character.LongBlunt ?? 0} /></td>
									<td>ShortBlunt <SkillLevel level={character.ShortBlunt ?? 0} /></td>
									<td>LongBlade <SkillLevel level={character.LongBlade ?? 0} /></td>
									<td>ShortBlade <SkillLevel level={character.ShortBlade ?? 0} /></td>
									<td>Spear <SkillLevel level={character.Spear ?? 0} /></td>
									<td>Maintenance <SkillLevel level={character.Maintenance ?? 0} /></td>
									<td >Firearm Aiming <SkillLevel level={character.Aiming ?? 0} /></td>
									<td>Reloading <SkillLevel level={character.Reloading ?? 0} /></td>
								</tr>
								<tr className='flex flex-col'>
									<td className='text-2xl'>Crafting </td>
									<td >Carpentry <SkillLevel level={character.Carpentry ?? 0} /></td>
									<td>Farming <SkillLevel level={character.Farming ?? 0} /></td>
									<td>Electrical <SkillLevel level={character.Electrical ?? 0} /></td>
									<td>Metalworking <SkillLevel level={character.Metalworking ?? 0} /></td>
									<td>Mechanics <SkillLevel level={character.Mechanics ?? 0} /></td>
									<td>Tailoring <SkillLevel level={character.Tailoring ?? 0} /></td>
								</tr>
								<tr className='flex flex-col'>
									<td className='text-2xl'>Survival</td>
									<td>Cooking <SkillLevel level={character.Cooking ?? 0} /></td>
									<td>FirstAid <SkillLevel level={character.FirstAid ?? 0} /></td>
									<td >Fishing <SkillLevel level={character.Fishing ?? 0} /></td>
									<td>Trapping <SkillLevel level={character.Trapping ?? 0} /></td>
									<td>Foraging <SkillLevel level={character.Foraging ?? 0} /></td>
								</tr>
							</tbody>
						</table>
					</div>



				</div>
			</div>
		</Scrollbar>
	);
};

export default PublicCharacterDetails;
