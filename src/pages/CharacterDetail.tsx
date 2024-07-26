import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SkillLevel from '../components/SkillLevel';

interface Character {
	charName: string;
	profession: string;
	isAlive: boolean;
	Combat: number;
	Axe: number;
	LongBlunt: number;
	ShortBlunt: number;
	LongBlade: number;
	ShortBlade: number;
	Spear: number;
	Maintenance: number;
	Firearm: number;
	Aiming: number;
	Reloading: number;
	Crafting: number;
	Carpentry: number;
	Cooking: number;
	Farming: number;
	FirstAid: number;
	Electrical: number;
	Metalworking: number;
	Mechanics: number;
	Tailoring: number;
	Survivalist: number;
	Fishing: number;
	Trapping: number;
	Foraging: number;
	Passive: number;
	Fitness: number;
	Strength: number;
	Agility: number;
	Sprinting: number;
	Lightfooted: number;
	Nimble: number;
	Sneaking: number;
	_id: unknown;
}

const getAvatarUrl = (charName: string): string => {
	return `/avatars/${charName}.webp`;
};

const CharacterDetail: React.FC = () => {
	const { name } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [character, setCharacter] = useState<Character | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`/api/characters/${name}`);
				setCharacter(response.data);
			} catch (error) {
				console.error('Error fetching character data', error);
			}
		};

		fetchData();
	}, [name]);

	const handleEdit = () => {
		navigate(`/character/edit/${character?.charName}`);
	};

	if (!character) {
		return <div>Loading...</div>;
	}

	return (
		<div className="p-4">
			<div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg">
			<h1 className="text-3xl font-bold mb-4">{character.charName}</h1>
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
								<th className='text-2xl'>Passive </th>

								<td>Fitness <SkillLevel level={character.Fitness} /></td>
								<td>Strength <SkillLevel level={character.Strength} /></td>
							</tr>
							<tr className='flex flex-col'>
								<td className='text-2xl'>Agility </td>
								<td>Sprinting <SkillLevel level={character.Sprinting} /></td>
								<td>Lightfooted <SkillLevel level={character.Lightfooted} /></td>
								<td>Nimble <SkillLevel level={character.Nimble} /></td>
								<td>Sneaking <SkillLevel level={character.Sneaking} /></td>
							</tr>
							<tr className='flex flex-col'>
								<td className='text-2xl'>Combat </td>
								<td >Axe <SkillLevel level={character.Axe} /></td>
								<td>LongBlunt <SkillLevel level={character.LongBlunt} /></td>
								<td>ShortBlunt <SkillLevel level={character.ShortBlunt} /></td>
								<td>LongBlade <SkillLevel level={character.LongBlade} /></td>
								<td>ShortBlade <SkillLevel level={character.ShortBlade} /></td>
								<td>Spear <SkillLevel level={character.Spear} /></td>
								<td>Maintenance <SkillLevel level={character.Maintenance} /></td>
							</tr>
							<tr className='flex flex-col'>
								<td className='text-2xl'>Crafting </td>
								<td >Carpentry <SkillLevel level={character.Carpentry} /></td>
								<td>Cooking <SkillLevel level={character.Cooking} /></td>
								<td>Farming <SkillLevel level={character.Farming} /></td>
								<td>FirstAid <SkillLevel level={character.FirstAid} /></td>
								<td>Electrical <SkillLevel level={character.Electrical} /></td>
								<td>Metalworking <SkillLevel level={character.Metalworking} /></td>
								<td>Mechanics <SkillLevel level={character.Mechanics} /></td>
								<td>Tailoring <SkillLevel level={character.Tailoring} /></td>
								<td >Firearm Aiming <SkillLevel level={character.Aiming} /></td>
								<td>Reloading <SkillLevel level={character.Reloading} /></td>
							</tr>
							<tr className='flex flex-col'>
								<td className='text-2xl'>Agility </td>
								<td >Fishing <SkillLevel level={character.Fishing} /></td>
								<td>Trapping <SkillLevel level={character.Trapping} /></td>
								<td>Foraging <SkillLevel level={character.Foraging} /></td>
							</tr>
						</tbody>
					</table>
				</div>



			</div>
			{character.charName === user?.discordId && (
				<button
					onClick={handleEdit}
					className="bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
				>
					Edit
				</button>
			)}
		</div>
	);
};

export default CharacterDetail;
