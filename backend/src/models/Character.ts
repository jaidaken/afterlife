import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICharacter extends Document {
	charName: string;
	profession: string;
	username: string;
	steamID: string;
	isAlive: boolean;
	zombieKills: number;
	survivorKills: number;
	hoursSurvived: number;
	health: number;
  hunger: number;
  thirst: number;
  endurance: number;
  fatigue: number;
  boredom: number;
  panic: number;
  stress: number;
  weight: number;
  calories: number;
  carbs: number;
  lipids: number;
  proteins: number;
  x: number;
  y: number;
  z: number;
  direction: string;
  bodyDamage: number;
  temperature: number;
  wetness: number;
  infectionLevel: number;
  Combat: number;
  Axe: number;
  LongBlunt: number;
  ShortBlunt: number;
  LongBlade: number;
  ShortBlade: number;
  Spear: number;
  Maintenance: number;
  Firearm: number;
  Aiming: number;
  Reloading: number;
  Crafting: number;
  Carpentry: number;
  Cooking: number;
  Farming: number;
  FirstAid: number;
  Electrical: number;
  Metalworking: number;
  Mechanics: number;
  Tailoring: number;
  Survivalist: number;
  Fishing: number;
  Trapping: number;
  Foraging: number;
  Passive: number;
  Fitness: number;
  Strength: number;
  Agility: number;
  Sprinting: number;
  Lightfooted: number;
  Nimble: number;
  Sneaking: number;
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
	health: { type: Number, required: true },
  hunger: { type: Number, required: true },
  thirst: { type: Number, required: true },
  endurance: { type: Number, required: true },
  fatigue: { type: Number, required: true },
  boredom: { type: Number, required: true },
  panic: { type: Number, required: true },
  stress: { type: Number, required: true },
  weight: { type: Number, required: true },
  calories: { type: Number, required: true },
  carbs: { type: Number, required: true },
  lipids: { type: Number, required: true },
  proteins: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
  direction: { type: String, required: true },
  bodyDamage: { type: Number, required: true },
  temperature: { type: Number, required: true },
  wetness: { type: Number, required: true },
  infectionLevel: { type: Number, required: true },
  Combat: { type: Number, required: true },
  Axe: { type: Number, required: true },
  LongBlunt: { type: Number, required: true },
  ShortBlunt: { type: Number, required: true },
  LongBlade: { type: Number, required: true },
  ShortBlade: { type: Number, required: true },
  Spear: { type: Number, required: true },
  Maintenance: { type: Number, required: true },
  Firearm: { type: Number, required: true },
  Aiming: { type: Number, required: true },
  Reloading: { type: Number, required: true },
  Crafting: { type: Number, required: true },
  Carpentry: { type: Number, required: true },
  Cooking: { type: Number, required: true },
  Farming: { type: Number, required: true },
  FirstAid: { type: Number, required: true },
  Electrical: { type: Number, required: true },
  Metalworking: { type: Number, required: true },
  Mechanics: { type: Number, required: true },
  Tailoring: { type: Number, required: true },
  Survivalist: { type: Number, required: true },
  Fishing: { type: Number, required: true },
  Trapping: { type: Number, required: true },
  Foraging: { type: Number, required: true },
  Passive: { type: Number, required: true },
  Fitness: { type: Number, required: true },
  Strength: { type: Number, required: true },
  Agility: { type: Number, required: true },
  Sprinting: { type: Number, required: true },
  Lightfooted: { type: Number, required: true },
  Nimble: { type: Number, required: true },
  Sneaking: { type: Number, required: true },
})


const Character: Model<ICharacter> = mongoose.model('Character', CharacterSchema)


export default Character
