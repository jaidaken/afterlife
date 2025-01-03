import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { Character } from '../models/Character';
import AvatarEditor from 'react-avatar-editor';
import { useLocation } from 'react-router-dom';
import Scrollbar from '../components/CustomScrollbar';

const ResubmitCharacter: React.FC = () => {
	const { user } = useAuth();
	const location = useLocation();
	const initialCharacter = location.state?.character as Character || {
		charName: '',
		discordId: '',
		password: '',
		isAlive: true,
		age: 0,
		birthplace: '',
		gender: '',
		appearance: '',
		personality: '',
		backstory: '',
		rejectionMessage: '',
	};

	const [character, setCharacter] = useState<Character>(initialCharacter);

	useEffect(() => {
		if (location.state?.character) {
			setCharacter(location.state.character);
		}
	}, [location.state]);

	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [zoom, setZoom] = useState(1);
	const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [showCropper, setShowCropper] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState('');

	const editorRef = useRef<AvatarEditor>(null);

	const capitalizeName = (name: string): string => {
		return name
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	};

   // Fetch the avatar image when the component mounts
			useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await fetch(`/public/avatars/${character.charName}.webp`);
                if (response.ok) {
                    const imageUrl = URL.createObjectURL(await response.blob());
                    setCroppedImage(imageUrl);
                }
            } catch (error) {
                console.error('Error fetching avatar image', error);
            }
        };

        if (character.charName) {
            fetchAvatar();
        }
    }, [character.charName]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

		const missingFields = [];
		if (!character.charName) missingFields.push('Character name');
		if (!user?.discordId) missingFields.push('Discord ID');
		if (!croppedImage) missingFields.push('Avatar');
		if (!character.age) missingFields.push('Age');
		if (!character.birthplace) missingFields.push('Birthplace');
		if (!character.gender) missingFields.push('Pronouns');
		if (!character.appearance) missingFields.push('Appearance');
		if (!character.personality) missingFields.push('Personality');
		if (!character.backstory) missingFields.push('Backstory');

		if (missingFields.length > 0) {
			setErrorMessage(`The following fields are required: ${missingFields.join(', ')}`);
			return;
		}

		if ((character.appearance?.length ?? 0) < 500) {
			setErrorMessage('Appearance must be at least 500 characters long.');
			return;
		}
		if ((character.personality?.length ?? 0) < 500) {
			setErrorMessage('Personality must be at least 500 characters long.');
			return;
		}
		if ((character.backstory?.length ?? 0) < 500) {
			setErrorMessage('Backstory must be at least 500 characters long.');
			return;
		}

		const capitalizedCharName = capitalizeName(character.charName);

		try {
				// Check if character name already exists
				const response = await fetch(`/api/characters/${capitalizedCharName}`);
				if (response.ok) {
						setErrorMessage('Character name already exists. Please choose a different name.');
						return;
				} else if (response.status !== 404) {
						setErrorMessage('An error occurred while checking the character name.');
						return;
				}
		} catch (error) {
				console.error('Error checking character name', error);
				setErrorMessage('An error occurred while checking the character name.');
				return;
		}

		try {
				const formData = new FormData();
				if (croppedImage) {
						const blob = await (await fetch(croppedImage)).blob();
						formData.append('avatar', blob, 'avatar.webp');
				}
				formData.append('charName', capitalizedCharName);

				const imageResponse = await fetch('/api/image/convert', {
						method: 'POST',
						body: formData,
						headers: {
								'Accept': 'application/json',
						},
				});

				if (!imageResponse.ok) {
						setErrorMessage('An error occurred while converting the image.');
						return;
				}

				const payload = {
						...character,
						charName: capitalizedCharName,
						discordId: user?.discordId,
						rejectionMessage: character.rejectionMessage,
				};

				const characterResponse = await fetch('/api/character-queue', {
						method: 'POST',
						headers: {
								'Content-Type': 'application/json',
						},
						body: JSON.stringify(payload),
				});

				if (!characterResponse.ok) {
						if (characterResponse.status === 409) {
								setErrorMessage('Character name already exists. Please choose a different name.');
						} else {
								setErrorMessage('There was an error creating the character.');
						}
						return;
				}

				// Delete character from rejectedCharacter database
				const deleteResponse = await fetch(`/api/rejected-characters/${capitalizedCharName}`, {
						method: 'DELETE',
				});

				if (!deleteResponse.ok) {
						console.error('Error deleting rejected character:', deleteResponse.statusText);
				}

				alert('Character creation successful, sent to queue for admin approval!');
				window.location.href = '/dashboard';
		} catch (error) {
				console.error('Error creating character', error);
				setErrorMessage('There was an error creating the character.');
		}
		};

	return (
		<Scrollbar>
			<div className="flex justify-center mt-6 pb-10">
				<div className="container mx-auto p-4 bg-gray-900 -lg shadow-lg w-full h-full md:w-3/4 lg:w-1/2">
					<h1 className="text-2xl mb-4">Resubmit Character</h1>
					<form onSubmit={handleSubmit}>

						<div className="mb-4 flex flex-col justify-center items-center">
						<h3 className='text-1xl text-red-600'>Rejection Reason:</h3>
						<h3 className='text-1xl text-red-600 pb-4'>{character.rejectionMessage}</h3>
							<label className="block text-white mb-1">Avatar</label>
							<div className='h-1/2 w-1/2'>
								{croppedImage && (
									<img src={croppedImage} alt="Cropped Avatar" className="mb-4" />
								)}
							</div>
							<div className="relative">
								<input
									type="file"
									accept="image/*"
									onChange={handleAvatarChange}
									className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								/>
								<button
									type="button"
									className="bg-blue-500 text-white py-2 px-4 rounded "
								>
									Choose File
								</button>
							</div>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-1">Character Name</label>
							<input
								type="text"
								name="charName"
								value={character.charName}
								onChange={handleChange}
								className="w-full p-1 bg-gray-950 h-7"
								required
								autoComplete="off"
								pattern="^[A-Za-z]+(-[A-Za-z]+)?\s[A-Za-z]+(-[A-Za-z]+)?$"
								title="Character name must consist of exactly two words separated by a space. Hyphenation is allowed."
							/>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-1">Age</label>
							<input
								type="number"
								name="age"
								value={character.age}
								onChange={handleChange}
								className="w-full h-7 p-1 bg-gray-950"
								required
								autoComplete="off"
								min="18"
								max="99"
							/>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-1">Birthplace</label>
							<input
								type="text"
								name="birthplace"
								value={character.birthplace}
								onChange={handleChange}
								className="w-full p-1 h-7 bg-gray-950"
								required
								autoComplete="off"
								maxLength={64}
							/>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-1">Pronouns</label>
							<select
								name="gender"
								value={character.gender}
								onChange={handleChange}
								className="w-full p-1 h-7 bg-gray-950"
								required
							>
								<option value="">Select Pronouns</option>
								<option value="He/Him">He/Him</option>
								<option value="She/Her">She/Her</option>
								<option value="They/Them">They/Them</option>
							</select>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-1">Appearance</label>
							<textarea
								name="appearance"
								value={character.appearance}
								onChange={handleChange}
								className="w-full p-2 bg-gray-950 h-64"
								required
								autoComplete="off"
								minLength={500}
							/>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-1">Personality</label>
							<textarea
								name="personality"
								value={character.personality}
								onChange={handleChange}
								className="w-full p-2 bg-gray-950 h-64"
								required
								autoComplete="off"
								minLength={500}
							/>
						</div>

						<div className="mb-4">
							<label className="block text-white mb-1">Backstory</label>
							<textarea
								name="backstory"
								value={character.backstory}
								onChange={handleChange}
								className="w-full p-2 bg-gray-950 h-64"
								required
								autoComplete="off"
								minLength={500}
							/>
						</div>

						{showCropper && avatarFile && (
							<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
								<div className="bg-gray-800 p-6 -lg shadow-lg">
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
											className="bg-green-500 text-white py-2 px-4 "
										>
											Done
										</button>
									</div>
								</div>
							</div>

						)}
						<div className="flex justify-center gap-4">
							<button
								type="submit"
								className="mb-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
							>
								Create Character
							</button>
							<button
								type="button"
								onClick={() => window.location.href = '/dashboard'}
								className="mb-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900-500"
							>
								Cancel
							</button>
						</div>


						{errorMessage && (
							<div className="mt-4 text-center">
								<p className="text-lg text-red-500">{errorMessage}</p>
							</div>
						)}
					</form>
				</div>
			</div>
		</Scrollbar>
	);
};

export default ResubmitCharacter;
