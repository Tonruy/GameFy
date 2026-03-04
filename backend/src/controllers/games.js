const {
  getTrendingGamesService,
  getIncomingGamesService,
  searchGameService,
  getGameByIdService,
  getNewGamesService,
  getSimilarGamesService,
  getTopRatedGamesService,
  getDiscoverGamesService,
  getGamesByGenreService,
  getGamesByPlatformService
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

const getIncomingGames = async (req, res) => {
  try {
    const incomingGames = await getIncomingGamesService();
    res.status(200).json(incomingGames);
  } catch (error) {
    console.error('Error in getIncomingGames:', error.message);
    res.status(500).json({ message: 'Error obtaining incoming games' });
  }
};
const getTopRatedGames = async (req, res) => {
  try {
    const topRatedGames = await getTopRatedGamesService();
    res.status(200).json(topRatedGames);
  } catch (error) {
    console.error('Error in getTopRatedGames:', error.message);
    res.status(500).json({ message: 'Error obtaining top rated games' });
  }
}

const getDiscoverGames = async (req, res) => {
  try {
    const discoverGames = await getDiscoverGamesService();
    res.status(200).json(discoverGames);
  } catch (error) {
    console.error('Error in getDiscoverGames:', error.message);
    res.status(500).json({ message: 'Error obtaining discovering games' });
  }
}



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

const getGamesByGenre = async (req, res) => {
  try {
    //Even when the service checks the parameter, we need here too because if we don't check here, "antonio" can pass the controller
    const genreId = req.params.genreId;
    const parsedId = Number(genreId);

    if(!parsedId ||!Number.isInteger(parsedId) || parsedId <= 0){
      return res.status(400).json({ message: 'Missing parameter genre ID ' });
    }

    const gamesByGenre = await getGamesByGenreService(parsedId);
    res.status(200).json(gamesByGenre);

  } catch (error) {
    console.error('Error in getGamesByGenre:', error.message);
    res.status(500).json({ message: 'Error obtaining games with the same genre' });
  }
};

const getGamesByPlatform = async (req, res) => {
  try {
    const platformId = req.params.platformId;
    const parsedId = Number(platformId);

    if(!parsedId ||!Number.isInteger(parsedId) || parsedId <= 0){
      return res.status(400).json({ message: 'Missing parameter platform ID ' });
    }

    const gamesByPlatform = await getGamesByPlatformService(parsedId);
    res.status(200).json(gamesByPlatform);

  } catch (error) {
    console.error('Error in getGamesByPlatform:', error.message);
    res.status(500).json({ message: 'Error obtaining games of the platform' });
  }
}



module.exports = {
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

};
