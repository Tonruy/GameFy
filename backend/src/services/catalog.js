const { executeIgdbQuery } = require('./igdb');

const getGenresService = async () => {
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
  return [
    { platformId: 6, name: 'PC' },
    { platformId: 167, name: 'PlayStation' }, 
    { platformId: 169, name: 'Xbox' },        
    { platformId: 130, name: 'Nintendo' }     
  ];
};

module.exports = {
  getGenresService,
  getPlatformsService
};
