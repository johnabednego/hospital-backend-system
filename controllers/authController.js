const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  // Make sure bcrypt is still imported here

// Signup
const signup = async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already in use' });
    }

    // Create the user without manually hashing the password
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,  // No need to hash the password here
      role: req.body.role,  // Ensure role is provided
    });

    await user.save();

    // Send success message
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(400).send({ message: 'Failed to create user', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log('User from DB:', user); // Log the found user

    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    // Check password match
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    console.log('Password Match:', passwordMatch); // Log comparison result

    if (!passwordMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).send({ message: 'Login failed', error: error.message });
  }
};

module.exports = {
  signup,
  login
};
