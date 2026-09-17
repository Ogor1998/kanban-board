const express = require('express')
const router = express.Router();
const { findActivity } = require('../controllers/Activities')


router.get('/:boardId', findActivity)



module.exports = router;