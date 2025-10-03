const Message = require('../models/Message');
const Property = require('../models/Property');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    
    if (!propertyId || !message) {
      return res.status(400).json({ message: 'Property ID and message are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Can't message yourself
    if (property.agent.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot message yourself' });
    }

    const newMessage = await Message.create({
      property: propertyId,
      from: req.user._id,
      to: property.agent,
      message
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('from', 'name email')
      .populate('to', 'name email')
      .populate('property', 'title');

    // Emit real-time message
    const io = req.app.get('io');
    if (io) {
      io.to(property.agent.toString()).emit('newMessage', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages for a property
exports.getPropertyMessages = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Only property owner or users who messaged can see messages
    const messages = await Message.find({
      property: propertyId,
      $or: [
        { from: req.user._id },
        { to: req.user._id }
      ]
    })
    .populate('from', 'name email')
    .populate('to', 'name email')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's conversations - separated by type
exports.getUserConversations = async (req, res) => {
  try {
    // Get inquired properties (user sent messages)
    const inquiredConversations = await Message.aggregate([
      {
        $match: { from: req.user._id }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: { property: '$property', to: '$to' },
          lastMessage: { $first: '$message' },
          lastMessageDate: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: {
                if: { $and: [{ $eq: ['$to', req.user._id] }, { $eq: ['$isRead', false] }] },
                then: 1,
                else: 0
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id.property',
          foreignField: '_id',
          as: 'property'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.to',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      { $unwind: '$property' },
      { $unwind: '$otherUser' },
      {
        $project: {
          type: { $literal: 'inquired' },
          property: { _id: 1, title: 1, images: 1 },
          otherUser: { _id: 1, name: 1, email: 1 },
          lastMessage: 1,
          lastMessageDate: 1,
          unreadCount: 1
        }
      }
    ]);

    // Get property messages (user received messages for their properties)
    const propertyConversations = await Message.aggregate([
      {
        $match: { to: req.user._id }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: { property: '$property', from: '$from' },
          lastMessage: { $first: '$message' },
          lastMessageDate: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: {
                if: { $eq: ['$isRead', false] },
                then: 1,
                else: 0
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id.property',
          foreignField: '_id',
          as: 'property'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.from',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      { $unwind: '$property' },
      { $unwind: '$otherUser' },
      {
        $project: {
          type: { $literal: 'property' },
          property: { _id: 1, title: 1, images: 1 },
          otherUser: { _id: 1, name: 1, email: 1 },
          lastMessage: 1,
          lastMessageDate: 1,
          unreadCount: 1
        }
      }
    ]);

    res.json({
      inquired: inquiredConversations.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate)),
      property: propertyConversations.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate))
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { propertyId, otherUserId } = req.body;
    
    await Message.updateMany(
      {
        property: propertyId,
        from: otherUserId,
        to: req.user._id,
        isRead: false
      },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};