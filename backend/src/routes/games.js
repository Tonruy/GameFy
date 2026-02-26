const express = require('express');
const router = express.Router();

const {
  getTrendingGames,
  getIncomingGames,
  searchGame,
  getGameById,
  getNewGames,
  getSimilarGames,
  getTopRatedGames,
  getDiscoverGames
} = require('../controllers/games');


router.get('/trending', getTrendingGames);
router.get('/new', getNewGames);
router.get('/incoming', getIncomingGames);
// GET /api/games/search?searchQuery=...
router.get('/discover', getDiscoverGames);
router.get('/search', searchGame);
router.get('/top-rated', getTopRatedGames);
router.get('/:gameId/similar', getSimilarGames);
router.get('/:gameId', getGameById);

module.exports = router;
