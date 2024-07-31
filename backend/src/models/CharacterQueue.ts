import mongoose from 'mongoose';

const CharacterQueueSchema = new mongoose.Schema({
  charName: { type: String, required: true },
  appearance: { type: String, required: true },
  personality: { type: String, required: true },
  alignment: { type: String, required: true },
  discordId: { type: String, required: true },
});

const CharacterQueue = mongoose.model('CharacterQueue', CharacterQueueSchema);

export default CharacterQueue;
