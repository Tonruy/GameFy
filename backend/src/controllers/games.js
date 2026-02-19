const {
  getTrendingGamesService,
  searchGameService,
  getGameByIdService,
  getNewGamesService,
  getGameMediaService,
  getSimilarGamesService
} = require('../services/games');

const getTrendingGames = async (req, res) => {
  try {
    const trendingGames = await getTrendingGamesService();
    res.status(200).json(trendingGames);
  } catch (error) {
    console.error('Error in getTrendingGames:', error.message);
    res.status(500).json({ message: 'Error obtaining trending games' });
  }
};

const searchGame = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery;

    if (!searchQuery) {
      return res.status(400).json({ message: 'Missing the parameter' });
    }

    const gamesList = await searchGameService(searchQuery);
    res.status(200).json(gamesList);

  } catch (error) {
    console.error('Error in searchGame:', error.message);
    res.status(500).json({ message: 'Error in search' });
  }
};

const getGameById = async (req, res) => {
  try {
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({ message: 'Missing parameter gameId' });
    }

    const gameDetail = await getGameByIdService(gameId);
    res.status(200).json(gameDetail);

  } catch (error) {
    console.error('Error in getGameById:', error.message);
    res.status(500).json({ message: 'Error obtaining game by ID' });
  }
};

const getNewGames = async (req, res) => {
  try {
    const newGames = await getNewGamesService();
    res.status(200).json(newGames);
  } catch (error) {
    console.error('Error in getNewGames:', error.message);
    res.status(500).json({ message: 'Error obtaining new games' });
  }
};

const getGameMedia = async (req, res) => {
  try {
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({ message: 'Missing parameter game ID' });
    }

    const mediaResponse = await getGameMediaService(gameId);
    res.status(200).json(mediaResponse);

  } catch (error) {
    console.error('Error in getGameMedia:', error.message);
    res.status(500).json({ message: 'Error obtaining game media' });
  }
};

const getSimilarGames = async (req, res) => {
  try {
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({ message: 'Missing parameter game ID ' });
    }

    const similarGames = await getSimilarGamesService(gameId);
    res.status(200).json(similarGames);

  } catch (error) {
    console.error('Error in getSimilarGames:', error.message);
    res.status(500).json({ message: 'Error obtaining similar games' });
  }
};

module.exports = {
  getTrendingGames,
  searchGame,
  getGameById,
  getNewGames,
  getGameMedia,
  getSimilarGames
};
