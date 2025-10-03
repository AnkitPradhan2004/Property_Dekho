// routes/chat.js
const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");
const controller = require("../controllers/chatController");

router.get("/rooms/:roomId/messages", isAuthenticated, controller.getRoomMessages);
router.get("/rooms/:roomId/unread-count", isAuthenticated, controller.getUnreadCount);
router.get("/user/rooms", isAuthenticated, controller.getUserRooms); // list rooms the user participates in (optional)
module.exports = router;
