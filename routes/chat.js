const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  sendMessage,
  getMessages,
  getConversations
} = require('../controllers/chatController');

router.post('/send', auth, upload.single('image'), sendMessage);
router.get('/messages/:userId', auth, getMessages);
router.get('/conversations', auth, getConversations);

module.exports = router;
