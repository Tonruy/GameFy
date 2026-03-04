const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/tokenGenerator');

const registerService = async (email, username, password) => {
  try {
    // Best practices: normalize username or email to lower case and no spaces
    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedUsername = String(username).trim();

    // Email format validation (no-spaces, @ and .xx)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return { errorMessage: 'Invalid email format' };
    }

    // Username validation ( +3, no spaces, )
    if (!username || username.length < 3 || username.includes(' ')) {
      return { errorMessage: 'Invalid username' };
}

    // Password validation
    if (password.length < 8) {
      return { errorMessage: 'Password must be at least 8 characters' };
    }
    // Important using normalizedEmail so we don't care about upperCases or spaces
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return { errorMessage: 'Email already in use' };
    }
    // Same as email
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
    // Transforming _id to string makes it easier for using it at frontend 
    // (no more {userId: ObjectId("123456")} ) -> userId: "123456"
    return { userId: createdUser._id.toString() };

  } catch (error) {
    return { errorMessage: 'Error registering user' };
  }
};


// I want the app to be logged in using email or username if the user is registered so identifier can be email or username
const loginService = async (identifier, password) => {
  try {
    //String because an username or email can contain numbers. Trim for spaces
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
      userId: user._id.toString(), //string for JWT
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
