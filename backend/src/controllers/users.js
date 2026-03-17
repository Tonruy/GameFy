const User = require('../models/User');
const { executeIgdbQuery } = require('../services/igdb');

const isValidNumericId = (value) => {
  const numericValue = Number(value);
  return Number.isInteger(numericValue) && numericValue > 0;
};

const buildIgdbImgUrl = (imagePath) => {
  if (!imagePath) {
    return null;
  }

  if (imagePath.startsWith('//')) {
    return `https:${imagePath}`;
  }

  return imagePath;
};

const mapGameMiniCard = (igdbGame) => {
  let coverUrl = null;
  if (igdbGame.cover && igdbGame.cover.url) {
    coverUrl = buildIgdbImgUrl(igdbGame.cover.url);
  }

  return {
    id: igdbGame.id,
    name: igdbGame.name || null,
    coverUrl
  };
};

const getMe = async (req, res) => {
  try {
    const payload = req.payload;

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error obtaining user info' });
  }
};

const updateMe = async (req, res) => {
  try {
    const payload = req.payload;
    const { avatarUrl, bio, username } = req.body;

    const updateData = {};

    if (username !== undefined) {
      const normalizedUsername = String(username).trim();
      if (!normalizedUsername || normalizedUsername.length < 3 || normalizedUsername.includes(' ')) {
        return res.status(400).json({ message: 'Invalid username' });
      }
      updateData.username = normalizedUsername;
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    const updateKeys = Object.keys(updateData);
    if (updateKeys.length === 0) {
      return res.status(400).json({ message: 'Missing fields to update' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ message: 'Username already in use' });
    }

    if (error && error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid fields to update' });
    }

    return res.status(500).json({ message: 'Error updating profile' });
  }
};

const deleteMe = async (req, res) => {
  try {
    const payload = req.payload;
    const deletedUser = await User.findByIdAndDelete(payload.userId).select('_id');

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Profile deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting profile' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'Missing parameter user ID' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error obtaining user by ID' });
  }
};

const getUsersList = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error obtaining users list' });
  }
};

const getMyFavorites = async (req, res) => {
  try {
    const payload = req.payload;

    const user = await User.findById(payload.userId).select('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let favoritesIds = [];
  if (Array.isArray(user.favorites)) {
    favoritesIds = user.favorites;
  }
    if (favoritesIds.length === 0) {
      return res.status(200).json([]);
    }

    const idsString = favoritesIds.join(', ');
    const igdbQuery = `
      fields name, cover.url;
      where id = (${idsString});
      limit 100;
    `;

    const igdbGames = await executeIgdbQuery('games', igdbQuery);

    const miniCards = [];
    if (igdbGames && Array.isArray(igdbGames)) {
      igdbGames.forEach((igdbGame) => {
        miniCards.push(mapGameMiniCard(igdbGame));
      });
    }

    return res.status(200).json(miniCards);
  } catch (error) {
    return res.status(500).json({ message: 'Error obtaining favorites' });
  }
};

const addFavorite = async (req, res) => {
  try {
    const payload = req.payload;
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({ message: 'Missing parameter game ID' });
    }

    if (!isValidNumericId(gameId)) {
      return res.status(400).json({ message: 'Invalid game ID' });
    }

    const numericGameId = Number(gameId);

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $addToSet: { favorites: numericGameId } },
      { new: true }
    ).select('_id');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Game added to favorites' });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding favorite' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const payload = req.payload;
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({ message: 'Missing parameter game ID' });
    }

    if (!isValidNumericId(gameId)) {
      return res.status(400).json({ message: 'Invalid game ID' });
    }

    const numericGameId = Number(gameId);

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $pull: { favorites: numericGameId } },
      { new: true }
    ).select('_id');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Game removed from favorites' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing favorite' });
  }
};

const getMyWishlist = async (req, res) => {
  try {
    const payload = req.payload;

    const user = await User.findById(payload.userId).select('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let wishlistIds = [];
  if (Array.isArray(user.wishlist)) {
    wishlistIds = user.wishlist;
  }
    if (wishlistIds.length === 0) {
      return res.status(200).json([]);
    }

    const idsString = wishlistIds.join(', ');
    const igdbQuery = `
      fields name, cover.url;
      where id = (${idsString});
      limit 100;
    `;

    const igdbGames = await executeIgdbQuery('games', igdbQuery);

    const miniCards = [];
    if (igdbGames && Array.isArray(igdbGames)) {
      igdbGames.forEach((igdbGame) => {
        miniCards.push(mapGameMiniCard(igdbGame));
      });
    }

    return res.status(200).json(miniCards);
  } catch (error) {
    return res.status(500).json({ message: 'Error obtaining wishlist' });
  }
};

const addWishlist = async (req, res) => {
  try {
    const payload = req.payload;
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({ message: 'Missing parameter game ID' });
    }

    if (!isValidNumericId(gameId)) {
      return res.status(400).json({ message: 'Invalid game ID' });
    }

    const numericGameId = Number(gameId);

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $addToSet: { wishlist: numericGameId } },
      { new: true }
    ).select('_id');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Game added to wishlist' });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding wishlist' });
  }
};

const removeWishlist = async (req, res) => {
  try {
    const payload = req.payload;
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({ message: 'Missing parameter game ID' });
    }

    if (!isValidNumericId(gameId)) {
      return res.status(400).json({ message: 'Invalid game ID' });
    }

    const numericGameId = Number(gameId);

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $pull: { wishlist: numericGameId } },
      { new: true }
    ).select('_id');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Game removed from wishlist' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing wishlist' });
  }
};

module.exports = {
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
};
