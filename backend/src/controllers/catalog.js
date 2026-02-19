const { getGenresService, getPlatformsService } = require('../services/catalog');

const getGenres = async (req, res) => {
  try {
    const genresList = await getGenresService();
    return res.status(200).json(genresList);
  } catch (error) {
    console.error('Error obtaining genres:', error.message);
    return res.status(500).json({ message: 'Error obtaining genres' });
  }
};

const getPlatforms = async (req, res) => {
  try {
    const platformsList = await getPlatformsService();
    return res.status(200).json(platformsList);
  } catch (error) {
    console.error('Error obtaining the platforms:', error.message);
    return res.status(500).json({ message: 'Error obtaining platforms' });
  }
};

module.exports = {
  getGenres,
  getPlatforms
};
