import React, { useRef, useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CharactersList from './pages/CharactersList';
import CharacterDetail from './pages/CharacterDetail';
import EditCharacter from './pages/EditCharacter';
import AuthProvider from './context/AuthContext';
import NavBar from './components/NavBar';
import { CustomScroll } from "react-custom-scroll";
import CreateCharacter from './pages/CreateCharacter';

const App: React.FC = () => {
	const navRef = useRef<HTMLDivElement>(null);
	const [contentHeight, setContentHeight] = useState('100vh');

	useEffect(() => {
			if (navRef.current) {
					const navHeight = navRef.current.offsetHeight;
					setContentHeight(`calc(100vh - ${navHeight}px)`);
			}
	}, [navRef]);

	return (
			<AuthProvider>
					<Router>
							<div ref={navRef}>
									<NavBar />
							</div>
							<CustomScroll>
									<div style={{ minHeight: contentHeight, overflowY: 'auto' }}>
											<Routes>
													<Route path="/" element={<Home />} />
													<Route path="/dashboard" element={<UserDashboard />} />
													<Route path="/admin" element={<AdminDashboard />} />
													<Route path="/characters" element={<CharactersList />} />
													<Route path="/character/:name" element={<CharacterDetail />} />
													<Route path="/character/edit/:id" element={<EditCharacter />} />
													<Route path="/create-character" element={<CreateCharacter />} />
											</Routes>
									</div>
							</CustomScroll>
					</Router>
			</AuthProvider>
	);
};

export default App;
