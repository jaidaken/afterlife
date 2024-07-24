// backend/src/models/Character.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICharacter extends Document {
  charName: string;
  profession: string;
  username: string;
  steamID: string;
  isAlive: boolean;
  zombieKills: number;
  survivorKills: number;
  hoursSurvived: number;
}

const CharacterSchema = new Schema<ICharacter>({
  charName: { type: String, required: true, unique: true },
  profession: { type: String, required: true },
  username: { type: String, required: true },
  steamID: { type: String, required: true },
  isAlive: { type: Boolean, required: true },
  zombieKills: { type: Number, required: true },
  survivorKills: { type: Number, required: true },
  hoursSurvived: { type: Number, required: true },
});

const Character: Model<ICharacter> = mongoose.model('Character', CharacterSchema);

export default Character;
