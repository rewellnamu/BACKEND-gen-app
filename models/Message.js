const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
// This schema defines a Message model with fields for sender, receiver, text, and image.