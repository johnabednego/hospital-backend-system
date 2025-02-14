const User = require('../../../models/User');
const bcrypt = require('bcryptjs');


describe('User Model Test', () => {
  // Increase the timeout for the test due to DB operations
  jest.setTimeout(10000); // Set the timeout to 10 seconds for this specific test

  it('should hash password before saving', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'patient'
    };

    // Create a new user
    const user = new User(userData);

    // Save the user to the database
    await user.save();

    // Ensure the password is hashed
    expect(user.password).not.toBe(userData.password);
    expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
  });

  it('should require email field', async () => {
    const userWithoutEmail = new User({
      name: 'Test User',
      password: 'password123',
      role: 'patient'
    });

    // Attempt to save a user without email
    await expect(userWithoutEmail.save()).rejects.toThrow();
  });
});
