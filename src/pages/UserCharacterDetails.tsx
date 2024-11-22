import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SkillLevel from '../components/SkillLevel';
import { Character } from '../models/Character';
import { decryptPassword } from '../utils/password';
import Scrollbar from '../components/CustomScrollbar';

const getAvatarUrl = (charName: string): string => {
	return `/avatars/${charName}.webp` || '';
};

const UserCharacterDetails: React.FC = () => {
	const { name } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [character, setCharacter] = useState<Character | null>(null);
	const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
	const [confirmationName, setConfirmationName] = useState<string>('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`/api/characters/${name}`);
				if (response.ok) {
					const data = await response.json();
					setCharacter(data);

					// Fetch and decrypt the password
					const encryptedPassword = data.password;
					const decrypted = await decryptPassword(encryptedPassword);
					setDecryptedPassword(decrypted);
				} else {
					console.error('Error fetching character data:', response.statusText);
				}
			} catch (error) {
				console.error('Error fetching character data', error);
			}
		};

		fetchData();
	}, [name]);

	const handleEdit = () => {
		navigate(`/character/edit/${character?.charName}`);
	};

	const togglePasswordVisibility = () => {
		if (!isPasswordVisible) {
			setIsPasswordVisible(true);
		}
	};


  const handleDeleteCharacter = async (character: Character) => {
    if (confirmationName !== character.charName) {
      alert('Character name does not match.');
      return;
    }

    try {
      const response = await fetch(`/api/characters/${character.charName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Character deleted successfully.');
        navigate('/dashboard');
        window.location.reload();
      } else {
        console.error('Error deleting character:', response.statusText);
        alert('Failed to delete character.');
      }
    } catch (error) {
      console.error('Error deleting character:', error);
      alert('Failed to delete character.');
    }
  };



	if (!character) {
		return <div>Loading...</div>;
	}

	return (
		<Scrollbar>
			<div className="p-4 flex items-center flex-col mt-10">
				<div className="user-character bg-gray-800 p-6 rounded-lg text-center shadow-lg">
					<h1 className="text-3xl font-bold mb-4">{character.charName}</h1>
					<img
						src={getAvatarUrl(character.charName)}
						alt={`${character.charName}'s avatar`}
						className="w-96 h-96 mx-auto mb-4 object-cover"
					/>
					{decryptedPassword && (
						<div className="mt-4">
							<h2 className="text-xl text-white">Password</h2>
							<div className="text-lg text-gray-400">
								<span
									onClick={togglePasswordVisibility}
									className={`cursor-pointer px-2 py-1 rounded ${isPasswordVisible ? 'text-lg text-gray-400' : 'bg-black text-white'
										}`}
								>
									{isPasswordVisible ? decryptedPassword : 'Click to view Password'}
								</span>
							</div>
						</div>
					)}
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
						<div className="delete-button flex justify-end mt-4">
							<button
								onClick={() => setSelectedCharacter(character)}
								className="bg-red-500 text-white py-2 px-4 rounded"
							>
								Delete Character
							</button>
						</div>
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
			{selectedCharacter && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-gray-800 p-6 rounded-lg shadow-lg">
						<h2 className="text-2xl mb-4 text-center text-red-700 font-bold">Are you sure?</h2>
						<p className='text-center'>This CANNOT be undone, <br />your character will be deleted, <br /><span style={{ color: 'red' }}>PERMANENTLY</span><br />and considered deceased.</p>
						<p className='p-3 text-center'>Type the full name of the character to confirm (Case Sensitive):</p>
						<input
							type="text"
							value={confirmationName}
							onChange={(e) => setConfirmationName(e.target.value)}
							className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
						/>
						<div className="flex justify-end">
							<button
								onClick={() => handleDeleteCharacter(selectedCharacter)}
								className="bg-red-500 text-white py-2 px-4 rounded mr-2"
							>
								Confirm
							</button>
							<button
								onClick={() => setSelectedCharacter(null)}
								className="bg-gray-500 text-white py-2 px-4 rounded"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</Scrollbar>
	);
};

export default UserCharacterDetails;
