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
      trim: true,
      minLength: 3
    },
    password: {
      type: String,
      required: true,
      minLength: 8
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    steam: {
      isLinked: { type: Boolean, default: false },
      steamId: { type: String, default: '' },
      profileUrl: { type: String, default: '' },
      lastSyncAt: { type: Date, default: null }
    },

    favorites: { type: [Number], default: [] },
    wishlist: { type: [Number], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
