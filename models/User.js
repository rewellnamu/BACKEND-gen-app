const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  online: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
  lastSeen: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
// This schema defines a User model with fields for username, email, password, online status, avatar URL, and last seen timestamp.