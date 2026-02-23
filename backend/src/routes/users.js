const express = require('express');
const verifyToken = require('../middlewares/authToken');
const roleCheck = require('../middlewares/roleCheck');
const router = express.Router();


const {
  getMe,
  updateMe,
  getUserById,
  getUsersList,
  getMyFavorites,
  addFavorite,
  removeFavorite,
  getMyWishlist,
  addWishlist,
  removeWishlist
} = require('../controllers/users');

// Protected (access token -> user profile)
router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, updateMe);

// Favorites
router.get('/me/favorites', verifyToken, getMyFavorites);
router.post('/me/favorites/:gameId', verifyToken, addFavorite);
router.delete('/me/favorites/:gameId', verifyToken, removeFavorite);

// Wishlist
router.get('/me/wishlist', verifyToken, getMyWishlist);
router.post('/me/wishlist/:gameId', verifyToken, addWishlist);
router.delete('/me/wishlist/:gameId', verifyToken, removeWishlist);

// Admin only
router.get('/:id', verifyToken, roleCheck, getUserById);
router.get('/', verifyToken, roleCheck, getUsersList);

module.exports = router;
