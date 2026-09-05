const express = require('express')
const router = express.Router();
const { allBoards, findBoard, createBoard, deleteBoard, inviteMember } = require('../controllers/Boards')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware/auth')
const { isBoardOwner, validateBoard, isBoardMemeber } = require('../middleware/middleware')



router.get('/', isLoggedIn, catchAsync(allBoards))
router.get('/:boardId', catchAsync(findBoard))
router.post('/', isLoggedIn, validateBoard, catchAsync(createBoard))
router.post('/:boardId/invite', isLoggedIn, isBoardOwner, isBoardMemeber, inviteMember)
router.delete('/:boardId', isLoggedIn, isBoardOwner, catchAsync(deleteBoard))



module.exports = router;