const express = require('express')
const router = express.Router();
const { findActivity, getUserActivities } = require('../controllers/Activities')
const { catchAsync } = require('../utils/catchAsync')


router.get('/user/:username', catchAsync(getUserActivities))
router.get('/:boardId', catchAsync(findActivity))



module.exports = router;