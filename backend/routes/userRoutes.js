const express = require('express')
const router = express.Router();
const { validateUser } = require('../middleware/middleware')
const { login, register, findUsers } = require('../controllers/Users')
const { catchAsync } = require('../utils/catchAsync')
const { authLimiter } = require('../middleware/rateLimiter')

router.get('/users', catchAsync(findUsers))
router.post('/register', authLimiter, validateUser, catchAsync(register))
router.post('/login', authLimiter, catchAsync(login))



module.exports = router;