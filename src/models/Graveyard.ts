// src/types/Graveyard.ts
import { ObjectId } from 'mongodb';

export interface Graveyard {
	_id?: ObjectId;
	charName: string;
	password: string;
	age?: number;
	birthplace?: string;
	gender?: string;
	appearance?: string;
	personality?: string;
	backstory?: string;
	rejectionMessage?: string;
	profession?: string;
	username?: string;
	steamID?: string;
	discordId: string;
	isAlive?: boolean;
	zombieKills?: number;
	survivorKills?: number;
	hoursSurvived?: number;
	health?: number;
  hunger?: number;
  thirst?: number;
  endurance?: number;
  fatigue?: number;
  boredom?: number;
  panic?: number;
  stress?: number;
  weight?: number;
  calories?: number;
  carbs?: number;
  lipids?: number;
  proteins?: number;
  x?: number;
  y?: number;
  z?: number;
  direction?: string;
  bodyDamage?: number;
  temperature?: number;
  wetness?: number;
  infectionLevel?: number;
  Combat?: number;
  Axe?: number;
  LongBlunt?: number;
  ShortBlunt?: number;
  LongBlade?: number;
  ShortBlade?: number;
  Spear?: number;
  Maintenance?: number;
  Firearm?: number;
  Aiming?: number;
  Reloading?: number;
  Crafting?: number;
  Carpentry?: number;
  Cooking?: number;
  Farming?: number;
  FirstAid?: number;
  Electrical?: number;
  Metalworking?: number;
  Mechanics?: number;
  Tailoring?: number;
  Survivalist?: number;
  Fishing?: number;
  Trapping?: number;
  Foraging?: number;
  Passive?: number;
  Fitness?: number;
  Strength?: number;
  Agility?: number;
  Sprinting?: number;
  Lightfooted?: number;
  Nimble?: number;
	Sneaking?: number;
	DeathDate: Date;
}
