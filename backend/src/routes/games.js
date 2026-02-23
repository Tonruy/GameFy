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


router.get('/trending', getTrendingGames);
router.get('/new', getNewGames);
// GET /api/games/search?searchQuery=...
router.get('/search', searchGame);
router.get('/:gameId/media', getGameMedia);
router.get('/:gameId/similar', getSimilarGames);
router.get('/:gameId', getGameById);

module.exports = router;
