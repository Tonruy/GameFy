const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/tokenGenerator');

const registerService = async (email, username, password) => {
  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedUsername = String(username).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return { errorMessage: 'Invalid email format' };
    }

    if (!username || username.length < 3 || username.includes(' ')) {
      return { errorMessage: 'Invalid username' };
}

    if (password.length < 8) {
      return { errorMessage: 'Password must be at least 8 characters' };
    }
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return { errorMessage: 'Email already in use' };
    }
    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return { errorMessage: 'Username already in use' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword
    });
    return { userId: createdUser._id.toString() };

  } catch (error) {
    return { errorMessage: 'Error registering user' };
  }
};

const loginService = async (identifier, password) => {
  try {
    const normalizedIdentifier = String(identifier).trim();

    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier.toLowerCase() },
        { username: normalizedIdentifier }
      ]
    });

    if (!user) {
      return { errorMessage: 'Invalid credentials' };
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return { errorMessage: 'Invalid credentials' };
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role
    };

    const token = generateToken(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'
    );

    const refreshToken = generateToken(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRES_IN || '60m'
    );

    return { token, refreshToken };

  } catch (error) {
    return { errorMessage: 'Error logging in' };
  }
};

module.exports = {
  registerService,
  loginService
};
