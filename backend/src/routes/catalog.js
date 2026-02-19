

const express = require('express');
const router = express.Router();

const { getGenres, getPlatforms } = require('../controllers/catalog');

router.get('/genres', getGenres);
router.get('/platforms', getPlatforms);

module.exports = router;
