const mongoose = require('mongoose');
const { Schema } = mongoose;


const cardSchema = new Schema({
    title: String,
    description: String,
    columnId: {
        type: Schema.Types.ObjectId,
        ref: 'Column'
    },
    order: Number,
    priority: String,
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    images: [String],
    createdAt: { type: Date, default: Date.now }
})


module.exports = mongoose.model('Card', cardSchema)