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
    console.error('Error en getTrendingGames:', error.message);
    res.status(500).json({ message: 'Error obteniendo juegos trending' });
  }
};

const searchGame = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery;

    if (!searchQuery) {
      return res.status(400).json({ message: 'Falta el parámetro searchQuery' });
    }

    const gamesList = await searchGameService(searchQuery);
    res.status(200).json(gamesList);

  } catch (error) {
    console.error('Error en searchGame:', error.message);
    res.status(500).json({ message: 'Error buscando juegos' });
  }
};

const getGameById = async (req, res) => {
  try {
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({ message: 'Falta el parámetro gameId' });
    }

    const gameDetail = await getGameByIdService(gameId);
    res.status(200).json(gameDetail);

  } catch (error) {
    console.error('Error en getGameById:', error.message);
    res.status(500).json({ message: 'Error obteniendo detalle del juego' });
  }
};

const getNewGames = async (req, res) => {
  try {
    const newGames = await getNewGamesService();
    res.status(200).json(newGames);
  } catch (error) {
    console.error('Error en getNewGames:', error.message);
    res.status(500).json({ message: 'Error obteniendo juegos nuevos' });
  }
};

const getGameMedia = async (req, res) => {
  try {
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({ message: 'Falta el parámetro gameId' });
    }

    const mediaResponse = await getGameMediaService(gameId);
    res.status(200).json(mediaResponse);

  } catch (error) {
    console.error('Error en getGameMedia:', error.message);
    res.status(500).json({ message: 'Error obteniendo media del juego' });
  }
};

const getSimilarGames = async (req, res) => {
  try {
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({ message: 'Falta el parámetro gameId' });
    }

    const similarGames = await getSimilarGamesService(gameId);
    res.status(200).json(similarGames);

  } catch (error) {
    console.error('Error en getSimilarGames:', error.message);
    res.status(500).json({ message: 'Error obteniendo juegos similares' });
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
