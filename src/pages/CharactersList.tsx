import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../models/Character';
import Scrollbar from '../components/CustomScrollbar';

const getAvatarUrl = (charName: string): string => {
    return `/avatars/${charName}.webp`;
};

const CharactersList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [graveyardCharacters, setGraveyardCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGraveyard, setShowGraveyard] = useState(false);

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

    useEffect(() => {
        if (showGraveyard) {
            const fetchGraveyardData = async () => {
                try {
                    const response = await fetch('/api/graveyard');
                    if (response.ok) {
                        const data = await response.json();
                        if (Array.isArray(data)) {
                            setGraveyardCharacters(data);
                        } else {
                            console.error('Unexpected response format:', data);
                        }
                    } else {
                        console.error('Error fetching graveyard characters:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching graveyard characters', error);
                }
            };

            fetchGraveyardData();
        } else {
            setGraveyardCharacters([]);
        }
    }, [showGraveyard]);

    if (loading) {
        return <div className="p-4"></div>;
    }

    const allCharacters = [...characters, ...graveyardCharacters];

    return (
        <Scrollbar>
            <div className="flex justify-center mt-4 mb-14">
                <div className="p-4 w-3/4">
                    <h1 className="text-3xl font-bold mb-4 flex justify-center">Characters</h1>
                    <div className="flex justify-center mb-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showGraveyard}
                                onChange={() => setShowGraveyard(!showGraveyard)}
                            />
                            <span>Show Graveyard Characters</span>
                        </label>
                    </div>
                    {allCharacters.length === 0 ? (
                        <p>No characters found.</p>
                    ) : (
                        <div className="flex flex-wrap gap-4 justify-center flex-grow flex-shrink">
                            {allCharacters.map((character, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg text-center transition ${
                                        graveyardCharacters.includes(character) ? 'bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                                >
                                    <Link to={`/character/${character.charName}`}>
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
