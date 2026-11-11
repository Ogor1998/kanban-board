const jwt = require('jsonwebtoken')

const DAY = 1000 * 60 * 60 * 24

module.exports.sendToken = (res, user) => {
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * DAY,    // keep this equal to expiresIn
    })
}