const express = require('express');
const router = express.Router();
const { findNotifications, openNotification } = require('../controllers/Notifications')
const { catchAsync } = require('../utils/catchAsync')



router.get('/user/:username', catchAsync(findNotifications))
router.put('/:notificationId', catchAsync(openNotification))


module.exports = router;