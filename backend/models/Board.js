const mongoose = require('mongoose');
const { Schema } = mongoose;


const boardSchema = new Schema({
    title: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members:
        [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            role: {
                type: String,
                enum: ['admin', 'member'],
                default: 'member'
            }
        }],
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Board', boardSchema)

