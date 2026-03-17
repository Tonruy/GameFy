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
  getDiscoverGames,
  getGamesByGenre,
  getGamesByPlatform
} = require('../controllers/games');

router.get('/trending', getTrendingGames);
router.get('/new', getNewGames);
router.get('/incoming', getIncomingGames);
router.get('/discover', getDiscoverGames);
router.get('/search', searchGame);
router.get('/top-rated', getTopRatedGames);
router.get('/:gameId/similar', getSimilarGames);
router.get('/genre/:genreId', getGamesByGenre)
router.get('/platform/:platformId', getGamesByPlatform)
router.get('/:gameId', getGameById);

module.exports = router;
