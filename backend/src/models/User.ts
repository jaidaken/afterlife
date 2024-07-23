// backend/src/models/User.ts

import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
  discordId: string;
  username: string;
  avatar: string;
  isAdmin: boolean;
}

const UserSchema = new Schema<IUser>({
  discordId: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  avatar: { type: String },
  isAdmin: { type: Boolean, default: false }
});

const User: Model<IUser> = mongoose.model('User', UserSchema);

export default User;
