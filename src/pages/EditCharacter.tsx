import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import Scrollbar from '../components/CustomScrollbar';

interface Character {
	id: string;
	charName: string;
	profession: string;
	isAlive: boolean;
	zombieKills: number;
	survivorKills: number;
	hoursSurvived: number;
}

const EditCharacter: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [character, setCharacter] = useState<Character>({
		id: '',
		charName: '',
		profession: '',
		isAlive: true,
		zombieKills: 0,
		survivorKills: 0,
		hoursSurvived: 0,
	});

	useEffect(() => {
		const fetchCharacter = async () => {
			try {
				const response = await axios.get(`/api/characters/${id}`);
				if (response.data.userId !== user?.discordId) {
					navigate('/');
				} else {
					setCharacter(response.data);
				}
			} catch (error) {
				console.error('Error fetching character data', error);
			}
		};

		fetchCharacter();
	}, [id, user, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setCharacter((prevCharacter) => ({
			...prevCharacter,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await axios.put(`/api/characters/${id}`, character);
			navigate(`/character/${character.charName}`);
		} catch (error) {
			console.error('Error updating character', error);
		}
	};

	return (
		<Scrollbar>
			<div className="p-4">
				<h1 className="text-2xl mb-4">Edit Character</h1>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-white">Character Name</label>
						<input
							type="text"
							name="charName"
							value={character.charName}
							onChange={handleChange}
							className="w-full p-2 rounded"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-white">Profession</label>
						<input
							type="text"
							name="profession"
							value={character.profession}
							onChange={handleChange}
							className="w-full p-2 rounded"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-white">Status</label>
						<select
							name="isAlive"
							value={character.isAlive ? 'true' : 'false'}
							onChange={handleChange}
							className="w-full p-2 rounded"
						>
							<option value="true">Alive</option>
							<option value="false">Dead</option>
						</select>
					</div>
					<div className="mb-4">
						<label className="block text-white">Zombie Kills</label>
						<input
							type="number"
							name="zombieKills"
							value={character.zombieKills}
							onChange={handleChange}
							className="w-full p-2 rounded"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-white">Survivor Kills</label>
						<input
							type="number"
							name="survivorKills"
							value={character.survivorKills}
							onChange={handleChange}
							className="w-full p-2 rounded"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-white">Hours Survived</label>
						<input
							type="number"
							name="hoursSurvived"
							value={character.hoursSurvived}
							onChange={handleChange}
							className="w-full p-2 rounded"
						/>
					</div>
					<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
						Save Changes
					</button>
				</form>
			</div>
		</Scrollbar>
	);
};

export default EditCharacter;
