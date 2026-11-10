const mongoose = require('mongoose');
const { Schema } = mongoose;



const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: String,
    firstname: String,
    lastname: String,
    image: String,
    description: String
}, { timestamps: true })


module.exports = mongoose.model('User', userSchema)