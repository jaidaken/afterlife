import React from 'react';
import UserAvatar from './UserAvatar';

interface UserProfileProps {
  user: {
    discordId: string;
    username: string;
    avatar: string;
    discriminator: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="flex items-center space-x-4">
      <UserAvatar userId={user.discordId} avatarHash={user.avatar} discriminator={user.discriminator} />
      <div>
        <h2 className="text-xl font-bold">{user.username}</h2>
        <p className="text-gray-600">{`Discord ID: ${user.discordId}`}</p>
      </div>
    </div>
  );
};

export default UserProfile;
