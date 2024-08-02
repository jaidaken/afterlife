import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User } from '../models/User';
import Scrollbar from '../components/CustomScrollbar';

const Users: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get('/api/users');
				setUsers(response.data);
			} catch (error) {
				console.error('Error fetching users', error);
			}
		};
		fetchUsers();
	}, []);

	if (!user || (user.role !== 'applicationTeam' && user.role !== 'admin' && user.role !== 'moderator')) {
		return <h1 className="text-gray-300">Access Denied</h1>;
	}

	const handleUserClick = (discordId: string) => {
		navigate(`/user/${discordId}`);
	};

	return (
		<Scrollbar>
			<div className="flex justify-center mt-4 mb-14">
				<div className="p-4 w-3/4">
					<h1 className="text-3xl font-bold mb-4 flex justify-center">Users</h1>
					<div className="flex flex-row gap-4 justify-center flex-grow flex-shrink">
						{users.map((user) => {
							const [username, discriminator] = user.username.split('#');
							return (
								<div
									key={user.discordId}
									onClick={() => handleUserClick(user.discordId)}
									className="cursor-pointer bg-gray-700 hover:bg-gray-600 p-4 text-center transition w-60"
								>
									<div className="flex flex-col items-center">
										<UserAvatar
											userId={user.discordId}
											avatarHash={user.avatar}
											discriminator={discriminator}
											className="w-24 h-24 mb-2"
										/>
										<h2 className="text-xl text-white">{username}</h2>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Scrollbar>

	);
}

export default Users;
