import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
  username: string;
  avatar: string;
  characters: string[];
  isMember: boolean;
  role: 'user' | 'admin' | 'moderator' | 'applicationTeam';
}

const UserSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String, required: true },
  characters: { type: [String], default: [] },
  isMember: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'admin', 'moderator', 'applicationTeam'], default: 'user', required: true },
});

// Add sorting by discordId
UserSchema.index({ discordId: 1 });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
