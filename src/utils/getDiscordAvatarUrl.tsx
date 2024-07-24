const getDiscordAvatarUrl = (discordId: string, avatarHash: string): string => {
  if (avatarHash) {
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png`;
  } else {
    // If the user has no avatar, Discord generates a default one
    // For example https://cdn.discordapp.com/embed/avatars/{userId % 5}.png
    const defaultAvatarId = parseInt(discordId) % 5; // Discord has 5 default avatar sets
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarId}.png`;
  }
};

export default getDiscordAvatarUrl;
