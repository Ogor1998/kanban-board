const jwt = require("jsonwebtoken");


const secret = process.env.JWT_SECRET || 'my-house-moves';



module.exports.isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        // console.log("No token found");

        return res.status(401).json({
            message: "Please log in",
        });
    }

    try {
        const payload = jwt.verify(token, secret);

        req.user = payload;

        next();

    } catch (err) {
        console.log("JWT verification failed:", err.message);

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};
