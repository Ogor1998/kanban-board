const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const secret = process.env.JWT_SECRET;


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
    await user.save();
    // console.log('this is the new user', user)
    res.json({
        message: "You've registered successfully",
        isLoggedIn: true,
        user: user
    })

}
module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    // console.log(user)
    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password",
            isLoggedIn: false,
        });
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.json({
            message: 'Invalid username or password',
            isLoggedIn: false
        })
    }

    const token = jwt.sign(
        { userId: user._id },
        secret,
        {
            expiresIn: "1h",
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,      // true in production with HTTPS
        sameSite: "lax",
        maxAge: 1000 * 60 * 60, // 1 hour
    });
    res.json({
        message: 'Logged in successfully',
        isLoggedIn: true,
        user: {
            id: user._id,
            username: user.username,
        }
    });
}

