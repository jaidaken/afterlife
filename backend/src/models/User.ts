// backend/src/models/User.ts

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
  username: string;
  avatar: string;
  isAdmin: boolean;
  characters: string[]; // Change this line to hold an array of strings
}

const UserSchema = new Schema<IUser>({
  discordId: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  avatar: { type: String },
  isAdmin: { type: Boolean, default: false },
  characters: [{ type: String }] // Change this line to hold an array of strings
});

const User: Model<IUser> = mongoose.model('User', UserSchema);

export default User;
