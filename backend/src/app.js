const express = require('express');

const gamesRouter = require('./routes/games');

const app = express();

app.use(express.json());

// Health check
// It gives 'Ok'  as response if the server is running properly at "http://localhost:3001/health" 
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Games routes
app.use('/api/games', gamesRouter);

module.exports = app;
