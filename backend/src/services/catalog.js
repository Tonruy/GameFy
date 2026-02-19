



const { executeIgdbQuery } = require('./igdb');

const getGenresService = async () => {
  const igdbQuery = `
    fields name;
    sort name asc;
    limit 100;
  `;

  const genresResponse = await executeIgdbQuery('genres', igdbQuery);

  const genresList = [];
  if (genresResponse && Array.isArray(genresResponse)) {
    genresResponse.forEach((genre) => {
      if (genre.id && genre.name) {
        genresList.push({
          genreId: genre.id,
          name: genre.name
        });
      }
    });
  }

  return genresList;
};

const getPlatformsService = async () => {
  const igdbQuery = `
    fields name;
    sort name asc;
    limit 100;
  `;

  const platformsResponse = await executeIgdbQuery('platforms', igdbQuery);

  const platformsList = [];
  if (platformsResponse && Array.isArray(platformsResponse)) {
    platformsResponse.forEach((platform) => {
      if (platform.id && platform.name) {
        platformsList.push({
          platformId: platform.id,
          name: platform.name
        });
      }
    });
  }

  return platformsList;
};

module.exports = {
  getGenresService,
  getPlatformsService
};
