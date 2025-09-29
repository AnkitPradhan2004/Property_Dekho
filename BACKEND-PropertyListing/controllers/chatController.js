const Message = require("../models/Message");
// GET messages for a room (pagination)
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Ensure the requesting user is a participant (optional: implement check)
    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 }) // oldest to newest
      .skip(skip)
      .limit(limit)
      .populate("from", "name email")
      .populate("to", "name email");

    res.json({ roomId, page, limit, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    const count = await Message.countDocuments({ roomId, to: userId, status: { $ne: "read" } });
    res.json({ roomId, unread: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Optional: list rooms with last message for the user
exports.getUserRooms = async (req, res) => {
  try {
    const userId = req.user._id;

    // aggregate distinct rooms where user is participant and last message
    const rooms = await Message.aggregate([
      { $match: { $or: [{ from: userId }, { to: userId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$roomId",
          lastMessage: { $first: "$$ROOT" },
          unread: { $sum: { $cond: [{ $and: [{ $eq: ["$to", userId] }, { $ne: ["$status", "read"] }] }, 1, 0] } }
        }
      },
      { $sort: { "lastMessage.createdAt": -1 } }
    ]);

    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
