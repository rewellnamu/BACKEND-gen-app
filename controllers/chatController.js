const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const msg = new Message({
      sender: req.user.id,
      receiver,
      text,
      image,
    });

    await msg.save();
    await msg.populate('sender', 'username avatar');
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    const conversations = [];
    const seen = new Set();

    for (const msg of messages) {
      const otherUser =
        msg.sender._id.toString() === userId ? msg.receiver : msg.sender;

      if (!seen.has(otherUser._id.toString())) {
        seen.add(otherUser._id.toString());
        conversations.push({
          user: otherUser,
          lastMessage: {
            text: msg.text,
            image: msg.image,
            createdAt: msg.createdAt,
          },
        });
      }
    }

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Error getting chats' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username avatar online lastSeen');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};