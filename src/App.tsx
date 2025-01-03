import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter as Router, useParams } from 'react-router-dom';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CharactersList from './pages/CharactersList';
import EditCharacter from './pages/EditCharacter';
import AuthProvider from './context/AuthContext';
import NavBar from './components/NavBar';
import CreateCharacter from './pages/CreateCharacter';
import ResubmitCharacter from './pages/ResubmitCharacter';
import Footer from './components/Footer';
import UserCharacterDetails from './pages/UserCharacterDetails';
import PublicCharacterDetails from './pages/PublicCharacterDetails';
import Lore from './pages/Lore';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import useAuth from './hooks/useAuth';
import { Character } from './models/Character';

const App: React.FC = () => {
	return (
		<AuthProvider>
			<Router>
				<div className="flex flex-col min-h-screen">
					<NavBar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/lore" element={<Lore />} />
						<Route path="/dashboard" element={<UserDashboard />} />
						<Route path="/admin" element={<AdminDashboard />} />
						<Route path="/users" element={<Users />} />
						<Route path="/user/:discordId" element={<UserDetails />} />
						<Route path="/characters" element={<CharactersList />} />
						<Route path="/character/:name" element={<CharacterDetailsWrapper />} />
						<Route path="/character/edit/:id" element={<EditCharacter />} />
						<Route path="/create-character" element={<CreateCharacter />} />
						<Route path="/resubmit-character" element={<ResubmitCharacter />} />
					</Routes>
					<Footer />
				</div>
			</Router>
		</AuthProvider>
	);
};

const CharacterDetailsWrapper: React.FC = () => {
	const { user } = useAuth();
	const { name } = useParams();
	const [character, setCharacter] = useState<Character | null>(null);

		useEffect(() => {
			const fetchData = async () => {
				try {
					const response = await fetch(`/api/characters/${name}`);
					if (response.ok) {
						const data = await response.json();
						setCharacter(data);
					} else {
						console.error('Error fetching character data:', response.statusText);
					}
				} catch (error) {
					console.error('Error fetching character data', error);
				}
			};

		fetchData();
	}, [name]);

	if (!character) {
		return <div>Loading...</div>;
	}

	return character.discordId === user?.discordId ? (
		<UserCharacterDetails />
	) : (
		<PublicCharacterDetails />
	);
};

export default App;
