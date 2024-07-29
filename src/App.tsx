import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CharactersList from './pages/CharactersList';
import CharacterDetail from './pages/CharacterDetail';
import EditCharacter from './pages/EditCharacter';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import ScrollBar from './components/ScrollBar';


const App: React.FC = () => {
	return (
		<AuthProvider>
			<NavBar />
			<ScrollBar>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/dashboard" element={<UserDashboard />} />
					<Route path="/admin" element={<AdminDashboard />} />
					<Route path="/characters" element={<CharactersList />} />
					<Route path="/character/:name" element={<CharacterDetail />} />
					<Route path="/character/edit/:id" element={<EditCharacter />} />
					</Routes>
			</ScrollBar>
		</AuthProvider>
	);
};

export default App;
