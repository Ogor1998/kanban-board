const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    content: String,
    cardID: {
        type: Schema.Types.ObjectId,
        ref: 'Card'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })



module.exports = mongoose.model('Comment', commentSchema)