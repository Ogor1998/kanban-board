const { rateLimit } = require('express-rate-limit')
module.exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: { message: 'Too many Login requests, Try again Later' },
    standardHeaders: true,
    legacyHeaders: false,
})