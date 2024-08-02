import mongoose from 'mongoose';

const CharacterQueueSchema = new mongoose.Schema({
	charName: { type: String, required: true },
	discordId: { type: String, required: true },
	age: { type: Number, required: true },
	birthplace: { type: String, required: true },
	gender: { type: String, required: true },
	appearance: { type: String, required: true },
	personality: { type: String, required: true },
	backstory: { type: String, required: true },
	rejectionMessage: { type: String, required: false },
});

const CharacterQueue = mongoose.model('CharacterQueue', CharacterQueueSchema);

export default CharacterQueue;
