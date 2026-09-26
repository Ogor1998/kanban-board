const express = require('express');
const router = express.Router();
const { findNotifications } = require('../controllers/Notifications')
const { catchAsync } = require('../utils/catchAsync')



router.get('/user/:username', catchAsync(findNotifications))


module.exports = router;