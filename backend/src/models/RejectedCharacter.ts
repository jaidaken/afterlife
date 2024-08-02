import mongoose from 'mongoose';

const RejectedCharacterSchema = new mongoose.Schema({
  charName: { type: String, required: true },
  discordId: { type: String, required: true },
  age: { type: Number, required: true },
  birthplace: { type: String, required: true },
  gender: { type: String, required: true },
  appearance: { type: String, required: true },
  personality: { type: String, required: true },
  backstory: { type: String, required: true },
  rejectionMessage: { type: String, required: true },
});

const RejectedCharacter = mongoose.model('RejectedCharacter', RejectedCharacterSchema);

export default RejectedCharacter;
