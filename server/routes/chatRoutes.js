
const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations, clearChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:contactId', protect, getMessages);
router.delete('/:contactId', protect, clearChat);

module.exports = router;
