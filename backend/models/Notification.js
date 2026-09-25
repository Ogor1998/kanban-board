const mongoose = require('mongoose')
const { Schema } = mongoose;


const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['CARD_ASSIGNED', 'BOARD_INVITE', 'MENTION', 'COMMENT', 'MEMBER_REMOVED'],
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    link: { type: String },
    isRead: { type: Boolean, default: false },

}, { timestamps: true })


module.exports = mongoose.model('Notification', notificationSchema)