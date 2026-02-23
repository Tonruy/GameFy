const express = require('express');
const { getGenres, getPlatforms } = require('../controllers/catalog');

const router = express.Router();

router.get('/genres', getGenres);
router.get('/platforms', getPlatforms);

module.exports = router;
