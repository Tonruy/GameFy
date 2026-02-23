const express = require('express');

const gamesRouter = require('./routes/games');
const catalogRouter = require('./routes/catalog');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const app = express();

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
