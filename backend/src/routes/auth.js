const express = require('express');
const router = express.Router();

const { registerService, loginService } = require('../services/auth');

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  const result = await registerService(email, username, password);

  if (result.errorMessage) {
    return res.status(400).json({ errorMessage: result.errorMessage });
  }

  return res.status(201).json(result);
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  const result = await loginService(identifier, password);

  if (result.errorMessage) {
    return res.status(401).json({ errorMessage: result.errorMessage });
  }

  return res.status(200).json(result);
});

module.exports = router;