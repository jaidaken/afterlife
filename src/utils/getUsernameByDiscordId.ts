import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../models/User';

const useUsers = () => {
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

    const getUsernameByDiscordId = (discordId: string) => {
        const user = users.find((user) => user.discordId === discordId);
        return user ? user.username : 'Unknown';
    };

    return { getUsernameByDiscordId };
};

export default useUsers;
