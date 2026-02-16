const express = require('express');
const router = express.Router();

const {
  getTrendingGames,
  searchGame,
  getGameById,
  getNewGames,
  getGameMedia,
  getSimilarGames
} = require('../controllers/games');

// GET /api/games/trending
router.get('/trending', getTrendingGames);

// GET /api/games/new
router.get('/new', getNewGames);

// GET /api/games/search?searchQuery=...
router.get('/search', searchGame);

// GET /api/games/:gameId/media
router.get('/:gameId/media', getGameMedia);

// GET /api/games/:gameId/similar
router.get('/:gameId/similar', getSimilarGames);

// GET /api/games/:gameId
router.get('/:gameId', getGameById);

module.exports = router;
