import mongoose, { Document, Model, Schema } from 'mongoose'
import { ObjectId } from 'mongodb'


export interface ICharacter extends Document {
	_id?: ObjectId;
	charName: string;
	password: string;
	age?: number;
	birthplace?: string;
	gender?: string;
	appearance?: string;
	personality?: string;
	backstory?: string;
	profession: string;
	username: string;
	steamID: string;
	discordId: string;
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
	password: { type: String, required: false },
	age: { type: Number, required: false },
	birthplace: { type: String, required: false },
	gender: { type: String, required: false },
	appearance: { type: String, required: false },
	personality: { type: String, required: false },
	backstory: { type: String, required: false },
  profession: { type: String, required: false },
  username: { type: String, required: false },
	steamID: { type: String, required: false },
	discordId: { type: String, required: true },
  isAlive: { type: Boolean, required: false },
  zombieKills: { type: Number, required: false },
  survivorKills: { type: Number, required: false },
	hoursSurvived: { type: Number, required: false },
	health: { type: Number, required: false },
  hunger: { type: Number, required: false },
  thirst: { type: Number, required: false },
  endurance: { type: Number, required: false },
  fatigue: { type: Number, required: false },
  boredom: { type: Number, required: false },
  panic: { type: Number, required: false },
  stress: { type: Number, required: false },
  weight: { type: Number, required: false },
  calories: { type: Number, required: false },
  carbs: { type: Number, required: false },
  lipids: { type: Number, required: false },
  proteins: { type: Number, required: false },
  x: { type: Number, required: false },
  y: { type: Number, required: false },
  z: { type: Number, required: false },
  direction: { type: String, required: false },
  bodyDamage: { type: Number, required: false },
  temperature: { type: Number, required: false },
  wetness: { type: Number, required: false },
  infectionLevel: { type: Number, required: false },
  Combat: { type: Number, required: false },
  Axe: { type: Number, required: false },
  LongBlunt: { type: Number, required: false },
  ShortBlunt: { type: Number, required: false },
  LongBlade: { type: Number, required: false },
  ShortBlade: { type: Number, required: false },
  Spear: { type: Number, required: false },
  Maintenance: { type: Number, required: false },
  Firearm: { type: Number, required: false },
  Aiming: { type: Number, required: false },
  Reloading: { type: Number, required: false },
  Crafting: { type: Number, required: false },
  Carpentry: { type: Number, required: false },
  Cooking: { type: Number, required: false },
  Farming: { type: Number, required: false },
  FirstAid: { type: Number, required: false },
  Electrical: { type: Number, required: false },
  Metalworking: { type: Number, required: false },
  Mechanics: { type: Number, required: false },
  Tailoring: { type: Number, required: false },
  Survivalist: { type: Number, required: false },
  Fishing: { type: Number, required: false },
  Trapping: { type: Number, required: false },
  Foraging: { type: Number, required: false },
  Passive: { type: Number, required: false },
  Fitness: { type: Number, required: false },
  Strength: { type: Number, required: false },
  Agility: { type: Number, required: false },
  Sprinting: { type: Number, required: false },
  Lightfooted: { type: Number, required: false },
  Nimble: { type: Number, required: false },
  Sneaking: { type: Number, required: false },
})


const Character: Model<ICharacter> = mongoose.model('Character', CharacterSchema)


export default Character
