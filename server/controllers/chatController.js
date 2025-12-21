
const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, content, propertyId } = req.body;

    if (!receiverId || !content) {
        res.status(400);
        throw new Error('Receiver ID and Content are required');
    }

    const message = await Message.create({
        sender: req.user._id,
        receiver: receiverId,
        property: propertyId || null,
        content: content,
        is_read: false
    });

    res.status(201).json(message);
});

// @desc    Get messages between current user and another user
// @route   GET /api/chat/:contactId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const contactId = req.params.contactId;

    const messages = await Message.find({
        $or: [
            { sender: req.user._id, receiver: contactId },
            { sender: contactId, receiver: req.user._id }
        ]
    }).sort({ createdAt: 1 });

    // Mark as read if receiver is current user
    // (Optional: can be done in separate call)
    await Message.updateMany(
        { sender: contactId, receiver: req.user._id, is_read: false },
        { $set: { is_read: true } }
    );

    res.json(messages);
});

// @desc    Get list of conversations (users chatted with)
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
    // Aggregation to find unique chat partners and latest message
    // This is complex in pure Mongoose, simpler approach:
    // Find all messages involving user, distinct by partner

    // Simplest approach for MVP:
    // 1. Get all messages where user is sender or receiver
    // 2. Extract unique partner IDs
    // 3. Populate partner details
    // 4. Attach latest message

    const userId = req.user._id;

    // Find all messages involving user
    const messages = await Message.find({
        $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const conversations = [];
    const seenPartners = new Set();

    for (const msg of messages) {
        const partnerId = msg.sender.toString() === userId.toString()
            ? msg.receiver.toString()
            : msg.sender.toString();

        if (!seenPartners.has(partnerId)) {
            seenPartners.add(partnerId);

            // Get partner details
            // Ideally should populate or optimize query
            const partner = await User.findById(partnerId).select('full_name avatar_url');

            if (partner) {
                conversations.push({
                    id: partner._id,
                    name: partner.full_name,
                    avatar: partner.avatar_url,
                    lastMessage: msg.content,
                    time: msg.createdAt, // Frontend can format "2m ago"
                    unread: msg.receiver.toString() === userId.toString() && !msg.is_read ? 1 : 0
                    // In a real app, unread count needs specific counting
                });
            }
        }
    }

    res.json(conversations);
});

// @desc    Clear chat history with a user
// @route   DELETE /api/chat/:contactId
// @access  Private
const clearChat = asyncHandler(async (req, res) => {
    const contactId = req.params.contactId;

    await Message.deleteMany({
        $or: [
            { sender: req.user._id, receiver: contactId },
            { sender: contactId, receiver: req.user._id }
        ]
    });

    res.json({ message: 'Chat cleared successfully' });
});

module.exports = {
    sendMessage,
    getMessages,
    getConversations,
    clearChat
};
