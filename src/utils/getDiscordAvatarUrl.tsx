const getDiscordAvatarUrl = (discordId: string, avatarHash: string): string => {
  if (avatarHash) {
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png`;
  } else {
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarId}.png`;
  }
};

export default getDiscordAvatarUrl;
