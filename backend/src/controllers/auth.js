const { registerService, loginService } = require('../services/auth');

const register = async (req, res) => {
  const { email, username, password } = req.body;

  const result = await registerService(email, username, password);

  if (result.errorMessage) {
    return res.status(400).json({ errorMessage: result.errorMessage });
  }

  return res.status(201).json(result);
};

const login = async (req, res) => {
  const { identifier, password } = req.body;

  const result = await loginService(identifier, password);

  if (result.errorMessage) {
    return res.status(401).json({ errorMessage: result.errorMessage });
  }

  return res.status(200).json(result);
};

module.exports = {
  register,
  login
};
