const express = require('express')
const router = express.Router();
const { allBoards, createBoard } = require('../controllers/Boards')
const catchAsync = require('../utils/catchAsync')


router.get('/', catchAsync(allBoards))
router.post('/', catchAsync(createBoard))



module.exports = router;