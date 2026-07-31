const jwt = require("jsonwebtoken");


const secret = process.env.JWT_SECRET || 'my-house-moves';

module.exports.isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: 'Please log in'
        })
    }
    try {

        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    } catch (err) {

        return res.status(401).json({
            message: "Invalid or expired token.",
        });

    }
}

