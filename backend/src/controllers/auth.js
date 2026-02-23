const jwt = require('jsonwebtoken');

const generateToken = require('../utils/tokenGenerator');
const { registerService, loginService } = require('../services/auth');

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await registerService(email, username, password);

    if (result.errorMessage) {
      if (result.errorMessage === 'Email already in use' || result.errorMessage === 'Username already in use') {
        return res.status(409).json({ message: result.errorMessage });
      }
      return res.status(400).json({ message: result.errorMessage });
    }

    return res.status(201).json({ message: 'User created', userId: result.userId });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    const result = await loginService(identifier, password);

    if (result.errorMessage) {
      if (result.errorMessage === 'Invalid credentials') {
        return res.status(401).json({ message: result.errorMessage });
      }
      return res.status(500).json({ message: result.errorMessage });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in' });
  }
};

// POST /refresh
// This endpoint validates refresh token and returns a new access token
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Missing refresh token' });
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.SECRET_TOKEN_REFRESH);
    } catch (error) {
      return res.status(401).json({ message: 'Token expired or invalid' });
    }

    const newAccessToken = generateToken(
      { userId: payload.userId, role: payload.role },
      process.env.SECRET_TOKEN,
      process.env.EXPIRES_TOKEN || '15m'
    );

    return res.status(200).json({ token: newAccessToken });
  } catch (error) {
    return res.status(500).json({ message: 'Error refreshing token' });
  }
};

module.exports = {
  register,
  login,
  refresh
};
