const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
        },
        content: {
            type: String,
            required: true,
        },
        is_read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
