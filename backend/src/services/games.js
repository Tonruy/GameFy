// We are going to stablish the data needed in every function and then we execute the Query
const { executeIgdbQuery } = require('./igdb');
const { mapGameCard, mapGameDetail } = require('../utils/gamesMapper');

const getTrendingGamesService = async () => {
  const igdbQuery = `
    fields 
      name, 
      rating, 
      total_rating_count, 
      cover.url;
    sort total_rating_count desc;
    limit 20;
  `;

  const igdbGames = await executeIgdbQuery('games', igdbQuery);

  const gamesList = [];
  // Again checking is an array because it is an external API
  if (igdbGames && Array.isArray(igdbGames)) {
    igdbGames.forEach((igdbGame) => {
      gamesList.push(mapGameCard(igdbGame));
    });
  }

  return gamesList;
};

// Determinating the fields needed for the game card and not searching by ID, its faster (no fetchs that we don't need)
const searchGameService = async (searchQuery) => {
  const igdbQuery = `
    search "${searchQuery}";
    fields
      id,
      name, 
      rating, 
      total_rating_count, 
      cover.url;
    limit 20;
  `;

  const igdbGames = await executeIgdbQuery('games', igdbQuery);

  const gamesList = [];
  if (igdbGames && Array.isArray(igdbGames)) {
    igdbGames.forEach((igdbGame) => {
      gamesList.push(mapGameCard(igdbGame));
    });
  }

  return gamesList;
};

//All the fields we are gonna use in Game Page
const getGameByIdService = async (gameId) => {
  const igdbQuery = `
    fields
      name,
      summary,
      storyline,
      rating,
      total_rating_count,
      first_release_date,
      cover.url,
      screenshots.url,
      videos.video_id,
      genres.name,
      platforms.name;
    where id = ${gameId};
    limit 1;
  `;

  const igdbGames = await executeIgdbQuery('games', igdbQuery);

  // Important for not error in case the array is empty (In that case, undefined)
  if (!igdbGames || !Array.isArray(igdbGames) || igdbGames.length === 0) {
    return null;
  }
  // IGDB gives an array with an object, even when the limit is set 1, we need to get the position [0]
  const gameDetail = mapGameDetail(igdbGames[0]);
  return gameDetail;
};


const getNewGamesService = async () => {
  const igdbQuery = `
    fields 
      name, 
      first_release_date, 
      rating, 
      total_rating_count, 
      cover.url;
    where first_release_date != null;
    sort first_release_date desc;
    limit 20;
  `;

  const igdbGames = await executeIgdbQuery('games', igdbQuery);

  const gamesList = [];
  if (igdbGames && Array.isArray(igdbGames)) {
    igdbGames.forEach((igdbGame) => {
      gamesList.push(mapGameCard(igdbGame));
    });
  }

  return gamesList;
};

// Best Practices : separating the media and calling it in the functions we need because is overfetching. Media is a big-data array and not needed in every fetch
const getGameMediaService = async (gameId) => {
  const igdbQuery = `
    fields 
      cover.url, 
      screenshots.url, 
      videos.video_id;
    where id = ${gameId};
    limit 1;
  `;

  const mediaResponse = await executeIgdbQuery('games', igdbQuery);

  // Important for not error in case the array is empty
  if (!mediaResponse || !Array.isArray(mediaResponse) || mediaResponse.length === 0) {
    return null;
  }

  const mediaDetail = mapGameDetail(mediaResponse[0]);

  return {
    gameId: mediaDetail.gameId,
    coverUrl: mediaDetail.coverUrl,
    screenshotsUrls: mediaDetail.screenshotsUrls,
    videoIds: mediaDetail.videoIds
  };
};

const getSimilarGamesService = async (gameId) => {
  // gameResponse is an array type Number
  const gameResponse = await executeIgdbQuery('games', `
    fields similar_games;
    where id = ${gameId};
    limit 1;
  `);
    // Important for not error in case the array is empty
  if (!gameResponse || !Array.isArray(gameResponse) || gameResponse.length === 0) {
    return [];
  }

  const similarGameIds = gameResponse[0].similar_games;

  if (!similarGameIds || similarGameIds.length === 0) {
    return [];
  }

  // IMPORTANT: we need a string, not numbers so we make  join with ',' and converting in array
  const similarGamesQuery = `
    fields 
      name, 
      rating, 
      total_rating_count, 
      cover.url;
    where id = (${similarGameIds.join(',')}); 
    limit 20;
  `;
  // We make a second query for obtaining the data of those games
  const igdbGames = await executeIgdbQuery('games', similarGamesQuery);

  const gamesList = [];
  if (igdbGames && Array.isArray(igdbGames)) {
    igdbGames.forEach((igdbGame) => {
      gamesList.push(mapGameCard(igdbGame));
    });
  }

  return gamesList;
};

module.exports = {
  getTrendingGamesService,
  searchGameService,
  getGameByIdService,
  getNewGamesService,
  getGameMediaService,
  getSimilarGamesService
};
