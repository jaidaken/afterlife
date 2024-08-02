import React from 'react';

interface UserAvatarProps {
  userId: string;
  avatarHash: string;
  discriminator: string;
  className?: string; // Add className as an optional prop
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userId, avatarHash, discriminator, className }) => {
  const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=128`;

  return (
    <img
      src={avatarUrl}
      alt={`Avatar of ${userId}#${discriminator}`}
      className={`${className}`} // Apply the className prop
    />
  );
};

export default UserAvatar;
