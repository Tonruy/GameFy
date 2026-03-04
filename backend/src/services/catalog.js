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

// IGDB response are too many deprecated platforms so I curated what the modal in frontend must show 
const getPlatformsService = async () => {
  // We need Id for for 
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
