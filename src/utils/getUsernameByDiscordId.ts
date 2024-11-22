import { useState, useEffect } from 'react';
import { User } from '../models/User';

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
        } else {
          console.error('Error fetching users:', response.statusText);
        }
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
