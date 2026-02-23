// This service allows the frontend to not "talk" directly with the API.
// Best Practices: FRONTEND MUST CONNECT ONLY WITH OUR BACKEND

const { executeIgdbQuery } = require('./igdb');

const getGenresService = async () => {
  // Example genre answer: 
//    {
//   "id": 5, (genre.id)
//   "name": "Shooter" (genre.name)
//    }
  const igdbQuery = `
    fields 
      name;
    sort name asc;
    limit 100;
  `;

  const genresResponse = await executeIgdbQuery('genres', igdbQuery);

  const genresList = [];
  if (genresResponse && Array.isArray(genresResponse)) {
    genresResponse.forEach((genre) => {
      // Same as games. It can response an genre without name but with an Id
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
    fields 
      name;
    sort name asc;
    limit 100;
  `;

  const platformsResponse = await executeIgdbQuery('platforms', igdbQuery);

  const platformsList = [];
  if (platformsResponse && Array.isArray(platformsResponse)) {
    platformsResponse.forEach((platform) => {
      // Same as games. It can response an platform without an Id or name
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
