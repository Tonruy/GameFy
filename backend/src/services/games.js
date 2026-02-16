const { executeIgdbQuery } = require('./igdb');
// We are going to stablish the data needed in every function and then execute the Query

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

  return await executeIgdbQuery(igdbQuery);
};

const searchGameService = async (searchQuery) => {
  const igdbQuery = `
    search "${searchQuery}";
    fields 
      name, 
      rating, 
      total_rating_count, 
      cover.url;
    limit 20;
  `;

  return await executeIgdbQuery(igdbQuery);
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

  return await executeIgdbQuery(igdbQuery);
};

//
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

  return await executeIgdbQuery(igdbQuery);
};


const getGameMediaService = async (gameId) => {
  const igdbQuery = `
    fields 
      cover.url, 
      screenshots.url, 
      videos.video_id;
    where id = ${gameId};
    limit 1;
  `;

  const mediaResponse = await executeIgdbQuery(igdbQuery);
  return mediaResponse;
};

const getSimilarGamesService = async (gameId) => {
  // gameResponse is an array type Number
  const gameResponse = await executeIgdbQuery(`
    fields similar_games;
    where id = ${gameId};
    limit 1;
  `);
    // Important for not error in case the array is empty
  if (!gameResponse || gameResponse.length === 0) {
    return [];
  }

  const similarGameIds = gameResponse[0].similar_games;

  if (!similarGameIds || similarGameIds.length === 0) {
    return [];
  }

  // IMPORTANT: we need a string, not numbers so we make de join with ','
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
  return await executeIgdbQuery(similarGamesQuery);
};


module.exports = {
  getTrendingGamesService,
  searchGameService,
  getGameByIdService,
  getNewGamesService,
  getGameMediaService,
  getSimilarGamesService
};
