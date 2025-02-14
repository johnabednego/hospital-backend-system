const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,  // Trim whitespaces to avoid any accidental space characters
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please enter a valid email address'] // Basic email validation
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'patient'], required: true },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Hash password before saving if it's modified
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Make sure email is provided and not empty
userSchema.pre('save', async function (next) {
  if (!this.email || this.email.trim() === "") {
    return next(new Error("Email cannot be empty or null"));
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
