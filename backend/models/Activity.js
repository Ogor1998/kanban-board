const mongoose = require('mongoose')
const { Schema } = mongoose;



const activitySchema = new Schema({
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    action: String,
    target: String,
    createdAt: { type: Date, default: Date.now }

})


module.exports = mongoose.model('Activity', activitySchema)