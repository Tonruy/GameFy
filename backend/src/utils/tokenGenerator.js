const jwt = require('jsonwebtoken');

// Best Practices: separate logic from configuration, thats why we ask for the expiration of the token as parameter

const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;