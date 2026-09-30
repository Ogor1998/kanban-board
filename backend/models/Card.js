const mongoose = require('mongoose');
const { Schema } = mongoose;

const checklistSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const cardSchema = new Schema({
    title: String,
    description: String,
    columnId: {
        type: Schema.Types.ObjectId,
        ref: 'Column'
    },
    order: Number,
    priority: String,
    dueDate: {
        type: Date
    },
    checklist: [checklistSchema],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    images: [String],
    createdAt: { type: Date, default: Date.now }
})


module.exports = mongoose.model('Card', cardSchema)