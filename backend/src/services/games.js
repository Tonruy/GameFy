const { executeIgdbQuery } = require('./igdb');
const { mapGameCard, mapGameDetail } = require('../utils/gamesMapper');

const buildIgdbImgUrl = (imagePath) => {
  if (!imagePath) {
    return null;
  }

  if (imagePath.startsWith('//')) {
    return `https:${imagePath}`;
  }

  return imagePath;
};

const toLargeScreenshotUrl = (url) => {
  if (!url) {
    return null;
  }

  return url.replace(/t_[a-z0-9_]+/i, 't_1080p');
};

const selectHeroImageUrl = (igdbGame) => {
  if (!igdbGame || !Array.isArray(igdbGame.screenshots)) {
    return null;
  }

  const validScreenshots = [];

  igdbGame.screenshots.forEach((screenshot) => {
    if (!screenshot || !screenshot.url) {
      return;
    }

    if (!screenshot.width || !screenshot.height) {
      return;
    }

    const isLandscape = screenshot.width >= screenshot.height;
    const ratio = screenshot.width / screenshot.height;
    const isHeroRatio = ratio >= 1.45 && ratio <= 2.4;
    const hasResolution = screenshot.width >= 1280 && screenshot.height >= 720;
    const hasAlphaChannel = Boolean(screenshot.alpha_channel);

    if (!isLandscape || !isHeroRatio || !hasResolution || hasAlphaChannel) {
      return;
    }

    validScreenshots.push(screenshot);
  });

  if (validScreenshots.length === 0) {
    return null;
  }

  validScreenshots.sort((leftScreenshot, rightScreenshot) => {
    const leftArea = (leftScreenshot.width || 0) * (leftScreenshot.height || 0);
    const rightArea = (rightScreenshot.width || 0) * (rightScreenshot.height || 0);

    return rightArea - leftArea;
  });

  const selectedScreenshot = validScreenshots[0];
  const selectedScreenshotUrl = buildIgdbImgUrl(selectedScreenshot.url);

  return toLargeScreenshotUrl(selectedScreenshotUrl);
};

const getTrendingGamesService = async () => {
  const nowUnix = Math.floor(Date.now() / 1000);
  const oneYearAgoUnix = nowUnix - (60 * 60 * 24 * 365);
  const igdbQuery = `
    fields 
      name, 
      rating, 
      total_rating_count, 
      first_release_date,
      hypes,
      cover.url,
      screenshots.url,
      screenshots.width,
      screenshots.height,
      screenshots.alpha_channel;
    where first_release_date != null 
      & first_release_date >= ${oneYearAgoUnix}
      & first_release_date <= ${nowUnix}
      & hypes != null;
    sort hypes desc;
    limit 20;
  `;

  const igdbGames = await executeIgdbQuery('games', igdbQuery);

  const gamesList = [];
  if (igdbGames && Array.isArray(igdbGames)) {
    igdbGames.forEach((igdbGame) => {
      const gameCard = mapGameCard(igdbGame);
      const heroImageUrl = selectHeroImageUrl(igdbGame);

      gamesList.push({
        ...gameCard,
        heroImageUrl: heroImageUrl
      });
    });
  }

  return gamesList;
};

const getIncomingGamesService = async () => {
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
  if (igdbGames && Array.isArray(igdbGames)) {
    igdbGames.forEach((igdbGame) => {
      gamesList.push(mapGameCard(igdbGame));
    });
  }

  return gamesList;
};

const searchGameService = async (searchQuery) => {
  const rawQuery = String(searchQuery || '').trim();
  if (!rawQuery) {
    return [];
  }

  let igdbQuery = `
    search "${rawQuery}";
    fields
      id,
      name;
    limit 10;
  `;

  let igdbGames = await executeIgdbQuery('games', igdbQuery);
  if (!igdbGames || !Array.isArray(igdbGames)) {
    igdbGames = [];
  }

  if (!igdbGames.length && rawQuery.includes(' ')) {
    const firstWord = rawQuery.split(/\s+/)[0];

    if (firstWord && firstWord.length >= 2) {
      igdbQuery = `
        search "${firstWord}";
        fields
          id,
          name;
        limit 10;
      `;

      igdbGames = await executeIgdbQuery('games', igdbQuery);
      if (!igdbGames || !Array.isArray(igdbGames)) {
        igdbGames = [];
      }
    }
  }

  const gamesList = [];
  igdbGames.forEach((igdbGame) => {
    gamesList.push({
  id: igdbGame.id,
  name: igdbGame.name || null
});
  });

  return gamesList;
};

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

  if (!igdbGames || !Array.isArray(igdbGames) || igdbGames.length === 0) {
    return null;
  }
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

const getSimilarGamesService = async (gameId) => {
  const gameResponse = await executeIgdbQuery('games', `
    fields similar_games;
    where id = ${gameId};
    limit 1;
  `);
  if (!gameResponse || !Array.isArray(gameResponse) || gameResponse.length === 0) {
    return [];
  }

  const similarGameIds = gameResponse[0].similar_games;

  if (!similarGameIds || similarGameIds.length === 0) {
    return [];
  }

  const similarGamesQuery = `
    fields 
      name, 
      rating, 
      total_rating_count, 
      cover.url;
    where id = (${similarGameIds.join(',')}); 
    limit 20;
  `;
  const igdbGames = await executeIgdbQuery('games', similarGamesQuery);

  const gamesList = [];
  if (igdbGames && Array.isArray(igdbGames)) {
    igdbGames.forEach((igdbGame) => {
      gamesList.push(mapGameCard(igdbGame));
    });
  }

  return gamesList;
};

const getGamesByGenreService = async (genreId) => {
  const parsedGenreId = Number(genreId);

  if (!Number.isInteger(parsedGenreId) || parsedGenreId <= 0){
    return [];
  }

  const igdbQuery = `
    fields
      id,
      name,
      rating,
      total_rating_count,
      first_release_date,
      cover.url;
    where 
      genres = (${parsedGenreId}) & cover != null;
    sort rating desc;
    limit 100;
  `;

  const gamesByGenre = await executeIgdbQuery('games',igdbQuery);
  
  const gamesList = [];
  if (gamesByGenre   && Array.isArray(gamesByGenre)) {
    gamesByGenre.forEach((game) => {
      gamesList.push(mapGameCard(game));
    });
  }
  return gamesList;
  

};

const getGamesByPlatformService = async (platformId) => {
  const parsedPlatforms = Number(platformId);

  if (!Number.isInteger(parsedPlatforms) ||parsedPlatforms <= 0) {
    return [];
  }

  const igdbQuery = `
    fields
      id,
      name,
      rating,
      total_rating_count,
      first_release_date,
      cover.url;
    where 
      platforms = (${parsedPlatforms  }) & cover != null;
    sort rating desc;
    limit 100;
  `;

  const gamesByPlatform = await executeIgdbQuery('games',igdbQuery);
  
  const gameList = [];

  if(gamesByPlatform  && Array.isArray(gamesByPlatform  )){
    gamesByPlatform.forEach((game) => {
      gameList.push(mapGameCard(game))
    });
  }
  return gameList;
};

module.exports = {
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
};
