const express = require('express');
const verifyToken = require('../middlewares/authToken');
const roleCheck = require('../middlewares/roleCheck');
const router = express.Router();

const {
  getMe,
  updateMe,
  deleteMe,
  getUserById,
  getUsersList,
  getMyFavorites,
  addFavorite,
  removeFavorite,
  getMyWishlist,
  addWishlist,
  removeWishlist
} = require('../controllers/users');

router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, updateMe);
router.delete('/me', verifyToken, deleteMe);

router.get('/me/favorites', verifyToken, getMyFavorites);
router.post('/me/favorites/:gameId', verifyToken, addFavorite);
router.delete('/me/favorites/:gameId', verifyToken, removeFavorite);

router.get('/me/wishlist', verifyToken, getMyWishlist);
router.post('/me/wishlist/:gameId', verifyToken, addWishlist);
router.delete('/me/wishlist/:gameId', verifyToken, removeWishlist);

router.get('/:id', verifyToken, roleCheck, getUserById);
router.get('/', verifyToken, roleCheck, getUsersList);

module.exports = router;
