const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { uploadToCloudinary } = require('../cloudinary')
const { sendToken } = require('../utils/setAuthToken')


const secret = process.env.JWT_SECRET;

module.exports.findUsers = async (req, res) => {
    const users = await User.find().select('-password').populate();
    ;
    res.json(users)
}


module.exports.register = async (req, res) => {
    const { firstname, lastname, username, password, email } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const user = new User({
        firstname,
        lastname,
        username,
        password: hashedPassword,
        email
    })
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer)
        user.image = result.secure_url
    }
    await user.save();


    sendToken(res, user)

    const { password: _pw, ...safeUser } = user.toObject();

    res.json({
        message: "You've registered successfully",
        isLoggedIn: true,
        user: safeUser
    })

}
module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password",
            isLoggedIn: false,
        });
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(401).json({
            message: 'Invalid username or password',
            isLoggedIn: false
        })
    }

    sendToken(res, user)
    res.json({
        message: 'Logged in successfully',
        isLoggedIn: true,
        user: {
            _id: user._id,
            username: user.username,
        }
    });
}

