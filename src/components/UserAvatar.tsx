import React from 'react';
import getDiscordAvatarUrl from '../utils/getDiscordAvatarUrl';

interface UserAvatarProps {
  userId: string;
  avatarHash: string;
  discriminator: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userId, avatarHash }) => {
  const avatarUrl = getDiscordAvatarUrl(userId, avatarHash);
  return <img src={avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full" />;
};

export default UserAvatar;
