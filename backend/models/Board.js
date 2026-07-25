const mongoose = require('mongoose');
const { Schema } = mongoose;


const boardSchema = new Schema({
    title: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
 createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Board', boardSchema)

