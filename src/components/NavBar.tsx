import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import useAuth from '../hooks/useAuth';
import getDiscordAvatarUrl from '../utils/getDiscordAvatarUrl';

const NavBar: React.FC = () => {
	const { user, login, logout } = useAuth();
	const [member, setMember] = useState<boolean | null>(null);
	const [isShaking, setIsShaking] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const invite = import.meta.env.VITE_DISCORD_INVITE_URL;

	useLayoutEffect(() => {
		setMember(null);
		const fetchUserData = async () => {
			if (user) {
				try {
					const response = await axios.get('/auth/me');
					setMember(response.data.isMember);
				} catch (error) {
					console.error('Error fetching user data:', error);
					setMember(false);
				}
			} else {
				setMember(false);
			}
		};

		fetchUserData();
	}, [user]);

	useEffect(() => {
		const interval = setInterval(() => {
			setIsShaking(true);
			setTimeout(() => setIsShaking(false), 800);

			if (buttonRef.current) {
				const rect = buttonRef.current.getBoundingClientRect();
				confetti({
					particleCount: 20,
					spread: 50,
					angle: 180,
					origin: {
						x: rect.left / window.innerWidth,
						y: (rect.top + rect.height / 2) / window.innerHeight,
					},
					decay: 0.9,
				});
				confetti({
					particleCount: 20,
					spread: 50,
					angle: 0,
					origin: {
						x: rect.right / window.innerWidth,
						y: (rect.top + rect.height / 2) / window.innerHeight,
					},
					decay: 0.9,
				});
			}
		}, 10000);

		return () => clearInterval(interval);
	}, []);

	const getDashboardTitle = (user: { role: string }) => {
		if (user.role === 'admin') return 'Admin Dashboard';
		if (user.role === 'moderator') return 'Moderator Dashboard';
		if (user.role === 'applicationTeam') return 'Application Team Dashboard';
		return 'Dashboard';
	};

	return (
		<nav className="bg-gray-900 px-4 py-2 shadow-md sticky top-0 w-full z-50">
			<div className="container mx-auto flex justify-between items-center">
				<div className="flex items-center space-x-4">
					<Link to="/" className="text-xl font-semibold text-white">
						AfterLife RP
					</Link>
					<Link to="/lore" className="text-gray-300 hover:text-white transition">
						Lore
					</Link>
					<Link to="/characters" className="text-gray-300 hover:text-white transition">
						Characters
					</Link>
					{user && (
						<>
							<Link to="/dashboard" className="text-gray-300 hover:text-white transition">
								User Dashboard
							</Link>
							{(user.role === 'admin' || user.role === 'moderator' || user.role === 'applicationTeam') && (
								<>
									<Link to="/admin" className="text-gray-300 hover:text-white transition">
										{getDashboardTitle(user)}
									</Link>
									<Link to="/users" className="text-gray-300 hover:text-white transition">
										Users
									</Link>
								</>
							)}
						</>
					)}
				</div>

				<div className='mr-10'>
					{member === null ? (
						<div></div>
					) : member === false ? (
						<button
							ref={buttonRef}
							onClick={() => window.open(invite, '_blank', 'noopener,noreferrer')}
							className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${isShaking ? 'shake' : ''}`}
						>
							Join the Discord Server
						</button>
					) : (
						<FaCheck className="text-green-500 hidden" />
					)}
				</div>

				<div className="flex items-center space-x-4">
					{user ? (
						<>
							<div className="avatar-wrapper">
								<img
									src={getDiscordAvatarUrl(user.discordId, user.avatar)}
									alt={`${user.username}'s avatar`}
									className="rounded-full border-2 border-white w-10 h-10"
								/>
							</div>
							<button
								onClick={logout}
								className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
							>
								Logout
							</button>
						</>
					) : (
						<button
							onClick={login}
							className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
						>
							Login with Discord
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
