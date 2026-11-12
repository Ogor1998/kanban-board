const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { uploadToCloudinary } = require('../cloudinary')
const { sendToken } = require('../utils/setAuthToken')
const Column = require('../models/Column')
const Card = require('../models/Card')
const Comment = require('../models/Comment')
const Board = require('../models/Board')

const secret = process.env.JWT_SECRET;

module.exports.findUsers = async (req, res) => {
    const users = await User.find().select('firstname username image').populate();
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


module.exports.findUserInfo = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username })
    if (!user) return res.status(404).json({ message: 'User not found' });
    const me = req.user.userId;
    const isSelf = user._id.equals(me)

    const query = {
        $or: [{ owner: user._id }, { 'members.user': user._id }]
    }

    if (!isSelf) {
        query.$and = [{ $or: [{ owner: me }, { 'members.user': me }] }]
    }

    const [board, commentsCount] = await Promise.all([
        Board.find(query),
        isSelf ? Comment.countDocuments({ author: user._id }) : null
    ])
    if (!board) {
        return res.status(404).json({
            message: 'Board not found'
        })
    }
    res.json({
        board,
        boardCount: board.length,
        commentsCount
    })
}
