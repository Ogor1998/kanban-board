const express = require('express')
const router = express.Router();
const { findActivity, getUserActivities } = require('../controllers/Activities')
const { catchAsync } = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/auth');


router.get('/user/:username', isLoggedIn, catchAsync(getUserActivities))
router.get('/boards/:boardId', isLoggedIn, catchAsync(findActivity))



module.exports = router;