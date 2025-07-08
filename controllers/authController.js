const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
};

exports.getUsers = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } }).select('username avatar');
  res.json(users);
};

exports.updateProfile = async (req, res) => {
  try {
    const update = {
      username: req.body.username,
    };
    if (req.file) {
      update.avatar = `/uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed' });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username avatar online lastSeen');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};