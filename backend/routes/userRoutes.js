const express = require('express')
const router = express.Router();
const { validateUser } = require('../middleware/middleware')
const { login, register, findUsers } = require('../controllers/Users')
const { catchAsync } = require('../utils/catchAsync')
const { authLimiter } = require('../middleware/rateLimiter')
const { upload } = require('../cloudinary');
const { isLoggedIn } = require('../middleware/auth');


router.get('/users', isLoggedIn, catchAsync(findUsers))
router.post('/register', authLimiter, upload.single('image'), validateUser, catchAsync(register))
router.post('/login', authLimiter, catchAsync(login))



module.exports = router;