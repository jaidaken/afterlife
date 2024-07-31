import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { Character } from '../models/Character';
import AvatarEditor from 'react-avatar-editor';

const CreateCharacter: React.FC = () => {
	const { user } = useAuth();
	const [character, setCharacter] = useState<Character>({
		charName: '',
		discordId: '',
		isAlive: true,
		appearance: '',
		personality: '',
		alignment: '',
	});

	const capitalizeName = (name: string): string => {
		return name
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	};

	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [zoom, setZoom] = useState(1);
	const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [showCropper, setShowCropper] = useState<boolean>(false);
	const editorRef = React.useRef<AvatarEditor>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCharacter((prevCharacter) => ({
			...prevCharacter,
			[name]: value,
		}));
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setAvatarFile(e.target.files[0]);
			setShowCropper(true);
		}
	};

	const handleCropDone = () => {
		if (editorRef.current) {
			const canvas = editorRef.current.getImage().toDataURL('image/webp');
			setCroppedImage(canvas);
			setShowCropper(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!character.charName || !user?.discordId || !croppedImage) {
			alert('Character name, Discord ID, and avatar are required');
			return;
		}

		const capitalizedCharName = capitalizeName(character.charName);

		try {
			const formData = new FormData();
			const blob = await (await fetch(croppedImage)).blob();
			formData.append('avatar', blob, 'avatar.webp');
			formData.append('charName', capitalizedCharName);

			await axios.post('/api/image/convert', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			const payload = {
				...character,
				charName: capitalizedCharName,
				discordId: user?.discordId,
			};

			await axios.post('/api/character-queue', payload, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			alert('Character created successfully!');
			window.location.href = '/dashboard';
		} catch (error) {
			console.error('Error uploading avatar', error);
			alert('There was an error creating the character.');
		}
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl mb-4">Create Character</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-white">Character Name</label>
					<input
						type="text"
						name="charName"
						value={character.charName}
						onChange={handleChange}
						className="w-full p-2 rounded"
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-white">Appearance</label>
					<input
						type="text"
						name="appearance"
						value={character.appearance}
						onChange={handleChange}
						className="w-full p-2 rounded"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-white">Personality</label>
					<input
						type="text"
						name="personality"
						value={character.personality}
						onChange={handleChange}
						className="w-full p-2 rounded"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-white">Alignment</label>
					<input
						type="text"
						name="alignment"
						value={character.alignment}
						onChange={handleChange}
						className="w-full p-2 rounded"
					/>
				</div>

				<div className="mb-4">
					<label className="block text-white">Avatar</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleAvatarChange}
						className="w-full p-2 rounded"
					/>
				</div>

				{showCropper && avatarFile && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<div className="bg-gray-800 p-6 rounded-lg shadow-lg">
							<h2 className="text-2xl mb-4">Crop Avatar</h2>
							<AvatarEditor
								ref={editorRef}
								image={avatarFile}
								width={500} // Adjust width as needed
								height={500} // Adjust height as needed
								border={0}
								color={[255, 255, 255, 0.6]} // RGBA
								scale={zoom}
								position={position}
								onPositionChange={setPosition}
								rotate={0}
							/>
							<div className="flex justify-between mt-4">
								<label className="text-white">Zoom</label>
								<input
									type="range"
									min="1"
									max="3"
									step="0.1"
									value={zoom}
									onChange={(e) => setZoom(parseFloat(e.target.value))}
									className="ml-2"
								/>
							</div>
							<div className="flex justify-end mt-4">
								<button
									type="button"
									onClick={handleCropDone}
									className="bg-green-500 text-white py-2 px-4 rounded"
								>
									Done
								</button>
							</div>
						</div>
					</div>
				)}

				<button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
			</form>
		</div>
	);
};

export default CreateCharacter;
