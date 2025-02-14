const mongoose = require('mongoose');

const actionableStepSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  type: { type: String, enum: ['checklist', 'plan'], required: true },
  description: { type: String, required: true },
  schedule: { type: Date },
  completed: { type: Boolean, default: false },
  repeatCount: { type: Number, default: 0 },
  totalRepeats: { type: Number }
});

module.exports = mongoose.model('ActionableStep', actionableStepSchema);