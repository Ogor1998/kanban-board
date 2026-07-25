const mongoose = require('mongoose');
const { Schema } = mongoose;


const columnSchema = new Schema({
    title: String,
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board'
    },

    order: Number,
    createdAt: { type: Date, default: Date.now }
})


module.exports = mongoose.model('Column', columnSchema)