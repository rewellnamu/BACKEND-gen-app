const Message = require('../models/Message');

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
    await msg.populate('sender', 'username avatar'); // ✅ POPULATE after saving

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
      .populate('sender', 'username avatar') // ✅ THIS IS REQUIRED
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};


