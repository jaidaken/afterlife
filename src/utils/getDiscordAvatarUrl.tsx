const getDiscordAvatarUrl = (discordId: string, avatarHash: string): string => {
  if (avatarHash) {
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png`;
  } else {
    return '';
  }
};

export default getDiscordAvatarUrl;
