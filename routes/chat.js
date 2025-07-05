const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const upload = require('multer')({ dest: 'uploads/' });

const { sendMessage, getMessages } = require('../controllers/chatController');

router.post('/send', auth, upload.single('image'), sendMessage);
router.get('/messages/:userId', auth, getMessages);

module.exports = router;
