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

// Comunication between front and back (CORS)
app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server requests and local tools without Origin header.
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

// Health check
// It gives 'Ok'  as response if the server is running properly at "http://localhost:3001/health" 
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Games routes
app.use('/api/games', gamesRouter);
// Catalog (genres,platform)
app.use('/api/catalog', catalogRouter);
// Login/Register/Refresh
app.use('/api/auth', authRouter);
// User actions
app.use('/api/users', usersRouter);



module.exports = app;
