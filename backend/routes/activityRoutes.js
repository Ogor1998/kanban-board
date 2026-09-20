const express = require('express')
const router = express.Router();
const { findActivity, getUserActivities } = require('../controllers/Activities')


router.get('/user/:username', getUserActivities)
router.get('/:boardId', findActivity)



module.exports = router;