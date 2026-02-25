// We are going to stablish the data needed in every function and then we execute the Query
const { executeIgdbQuery } = require('./igdb');
const { mapGameCard, mapGameDetail } = require('../utils/gamesMapper');

const getTrendingGamesService = async () => {
  const nowUnix = Math.floor(Date.now() / 1000); // 1000 because we need milisecs
  const oneYearAgoUnix = nowUnix - (60 * 60 * 24 * 365); // seconds in a year
// Where only can gives one boolean answer so all conditions together with &
  const igdbQuery = `
    fields 
      name, 
      rating, 
      total_rating_count, 
      first_release_date,
      hypes,
      cover.url;
    where first_release_date != null 
      & first_release_date >= ${oneYearAgoUnix}
      & first_release_date <= ${nowUnix}
      & hypes != null;
    sort hypes desc;
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

const getIncomingGamesService = async () => {
  // Incoming: Most hyped upcoming games
  const nowUnix = Math.floor(Date.now() / 1000);

  const igdbQuery = `
    fields 
      name,
      rating,
      total_rating_count,
      first_release_date,
      hypes,
      cover.url;
    where first_release_date != null
      & first_release_date > ${nowUnix}
      & hypes != null;
    sort hypes desc;
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

const getTopRatedGamesService = async () => {
  // Specific where because games re-edited like "The Witcher" appeared 4 times in a row
  const igdbQuery = `
    fields 
      id,
      name, 
      rating, 
      total_rating_count, 
      parent_game,
      version_parent,
      cover.url;
    where 
      rating != null
      & total_rating_count > 50
      & cover != null;
    sort rating desc;
    limit 100;
  `;

  const igdbGames = await executeIgdbQuery('games', igdbQuery);

  const gamesList = [];
  const uniqueNames = new Set();
  // Again checking is an array because it is an external API
  if (igdbGames && Array.isArray(igdbGames)) {
    igdbGames.forEach((igdbGame) => {
      const gameCard = mapGameCard(igdbGame);

      if (!gameCard.name) {
        return;
      }

      if (igdbGame.parent_game || igdbGame.version_parent) {
        return;
      }

      const normalizedName = gameCard.name.trim().toLowerCase();
      const canonicalName = normalizedName
        .replace(/\s+-\s+.*$/i, '')
        .replace(
          /:\s*(game of the year edition|complete edition|special edition|anniversary edition|ultimate edition|the final cut|hd edition|definitive edition|director's cut|enhanced edition|remastered)$/i,
          ''
        )
        .replace(/\s*\((game of the year edition|complete edition|special edition|anniversary edition|ultimate edition|the final cut|hd edition|definitive edition|director's cut|enhanced edition|remastered)\)\s*$/i, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (uniqueNames.has(canonicalName)) {
        return;
      }

      uniqueNames.add(canonicalName);
      gamesList.push(gameCard);
    });
  }

  return gamesList.slice(0, 20);
};

const getDiscoverGamesService = async () => {
  // Discover logic: Popular games but ONLY from the last 12 months (avoid old classics dominating the list)
  const oneYearAgoUnix = Math.floor(Date.now() / 1000) - (60 * 60 * 24 * 365);

  const igdbQuery = `
    fields 
      name, 
      first_release_date,
      rating, 
      total_rating_count, 
      cover.url;
    where first_release_date != null & first_release_date >= ${oneYearAgoUnix};
    sort popularity desc;
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
  const nowUnix = Math.floor(Date.now() / 1000);
  const oneYearAgoUnix = nowUnix - (60 * 60 * 24 * 365);
  const igdbQuery = `
    fields 
      id,
      name, 
      first_release_date, 
      rating, 
      total_rating_count, 
      cover.url;
    where 
      first_release_date != null
      & first_release_date >= ${oneYearAgoUnix}
      & first_release_date <= ${nowUnix};
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
      screenshots.width,
      screenshots.height,
      screenshots.alpha_channel,
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
  const screenshots = Array.isArray(mediaDetail.screenshots) ? mediaDetail.screenshots : [];

  const validLandscapeScreenshots = screenshots.filter((screenshot) => {
    if (!screenshot || !screenshot.url) {
      return false;
    }

    if (!screenshot.width || !screenshot.height) {
      return false;
    }

    const ratio = screenshot.width / screenshot.height;
    const isLandscape = screenshot.width >= screenshot.height;
    const isGameplayLikeRatio = ratio >= 1.45 && ratio <= 2.4;

    return isLandscape && isGameplayLikeRatio && !screenshot.alphaChannel;
  });

  const fallbackScreenshots = screenshots.filter((screenshot) => {
    if (!screenshot || !screenshot.url) {
      return false;
    }

    if (!screenshot.width || !screenshot.height) {
      return false;
    }

    return screenshot.width >= screenshot.height;
  });

  let heroScreenshotUrl = null;
  const byResolutionDesc = (left, right) => {
    const leftArea = (left.width || 0) * (left.height || 0);
    const rightArea = (right.width || 0) * (right.height || 0);

    return rightArea - leftArea;
  };

  if (validLandscapeScreenshots.length > 0) {
    validLandscapeScreenshots.sort(byResolutionDesc);
    heroScreenshotUrl = validLandscapeScreenshots[0].url;
  } else if (fallbackScreenshots.length > 0) {
    fallbackScreenshots.sort(byResolutionDesc);
    heroScreenshotUrl = fallbackScreenshots[0].url;
  } else if (mediaDetail.screenshotsUrls && mediaDetail.screenshotsUrls.length > 0) {
    heroScreenshotUrl = mediaDetail.screenshotsUrls[0];
  }

  return {
    gameId: mediaDetail.gameId,
    coverUrl: mediaDetail.coverUrl,
    screenshotsUrls: mediaDetail.screenshotsUrls,
    heroScreenshotUrl: heroScreenshotUrl,
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
  getIncomingGamesService,
  searchGameService,
  getGameByIdService,
  getNewGamesService,
  getGameMediaService,
  getSimilarGamesService,
  getTopRatedGamesService,
  getDiscoverGamesService
};
