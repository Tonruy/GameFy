const express = require('express');

const gamesRouter = require('./routes/games');
const catalogRouter = require('./routes/catalog');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const cors = require('cors');

const app = express();

const defaultAllowedOrigins = [
  'http://localhost:5173'
];

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : defaultAllowedOrigins;

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin not allowed by CORS'));
  }
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/games', gamesRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

module.exports = app;
