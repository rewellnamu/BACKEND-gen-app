const router = require('express').Router();
const { register, login, getUsers } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const upload = require('multer')({ dest: 'uploads/' });
const { updateProfile } = require('../controllers/authController');

router.post('/signup', register);
router.post('/login', login);
router.get('/users', auth, getUsers); // <-- Add this
router.put('/update', auth, upload.single('avatar'), updateProfile);
router.get('/user/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username avatar lastSeen');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'User not found' });
  }
});

module.exports = router;
