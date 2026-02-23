// routes/users.js → base /api/users

// Protected with access token (middleware authToken.js):

// GET /me → returns logged user info

// PATCH /me (optional) → edit profile

// Favorites (access token):

// GET /me/favorites → returns game mini cards (cover + name)

// POST /me/favorites/:gameId → add game to favorites

// DELETE /me/favorites/:gameId → remove game from favorites

// Wishlist (access token):

// GET /me/wishlist → returns game mini cards (cover + name)

// POST /me/wishlist/:gameId → add game to wishlist

// DELETE /me/wishlist/:gameId → remove game from wishlist

// Admin only (authToken + roleCheck):

// GET /:id (optional)

// GET / (optional list users)

const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/authToken');
const roleCheck = require('../middlewares/roleCheck');

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

// Protected (access token)
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


// Original comments kept for reference (do not remove):
// routes/users.js → base /api/users
// 
// Protegidos con access token (middleware authToken.js):
// 
// GET /me → devuelve info del usuario logueado
// 
// PATCH /me (opcional) → editar perfil
// 
// Solo admin (authToken + roleCheck):
// 
// GET /:id (opcional)
// 
// GET / (opcional list users)
// 
// const {