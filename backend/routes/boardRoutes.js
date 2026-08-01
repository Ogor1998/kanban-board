const express = require('express')
const router = express.Router();
const { allBoards, createBoard, deleteBoard } = require('../controllers/Boards')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware/auth')


router.get('/', catchAsync(allBoards))
router.post('/', isLoggedIn, catchAsync(createBoard))
router.delete('/:id', isLoggedIn, catchAsync(deleteBoard))



module.exports = router;