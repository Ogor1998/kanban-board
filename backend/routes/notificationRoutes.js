const express = require('express');
const router = express.Router();
const { findNotifications, openNotification } = require('../controllers/Notifications')
const { catchAsync } = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware/auth')




router.get('/user/:username', isLoggedIn, catchAsync(findNotifications))
router.put('/:notificationId', isLoggedIn, catchAsync(openNotification))


module.exports = router;