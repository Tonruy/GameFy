const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    // Profile (optional fields)
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },

    steam: {
      isLinked: { type: Boolean, default: false },
      steamId: { type: String, default: '' },
      profileUrl: { type: String, default: '' },
      lastSyncAt: { type: Date, default: null }
    },

    // Favorites and wishlist store IGDB game IDs
    favorites: { type: [Number], default: [] },
    wishlist: { type: [Number], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
