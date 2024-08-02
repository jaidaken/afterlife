export interface User {
  discordId: string;
  username: string;
  avatar: string;
  characters: string[];
  isMember: boolean;
  role: 'user' | 'admin' | 'moderator' | 'applicationTeam';
}
