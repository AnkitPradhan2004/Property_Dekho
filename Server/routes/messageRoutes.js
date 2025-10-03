const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(isAuthenticated);

// Send message
router.post('/', messageController.sendMessage);

// Get messages for a property
router.get('/property/:propertyId', messageController.getPropertyMessages);

// Get user's conversations
router.get('/conversations', messageController.getUserConversations);

// Mark messages as read
router.put('/read', messageController.markAsRead);

module.exports = router;