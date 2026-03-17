const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.payload = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
};

module.exports = verifyToken;
