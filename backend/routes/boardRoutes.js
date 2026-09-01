const express = require('express')
const router = express.Router();
const { allBoards, findBoard, createBoard, deleteBoard } = require('../controllers/Boards')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware/auth')
const { isAuthor } = require('../middleware/middleware')
const { validateBoard } = require('../middleware/middleware')


router.get('/', isLoggedIn, catchAsync(allBoards))
router.get('/:boardId', catchAsync(findBoard))
router.post('/', isLoggedIn, validateBoard, catchAsync(createBoard))
router.delete('/:boardId', isLoggedIn, isAuthor, catchAsync(deleteBoard))



module.exports = router;