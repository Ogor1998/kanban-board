const express = require('express')
const router = express.Router();
const { allComments, commentCount, createComment, deleteComment } = require('../controllers/Comments')
const { isLoggedIn } = require('../middleware/auth')
const { isCommentAuthor } = require('../middleware/middleware')
const catchAsync = require('../utils/catchAsync')

router.get('/:cardID', catchAsync(allComments))

router.get('/:cardID/count', catchAsync(commentCount))

router.post('/', isLoggedIn, catchAsync(createComment))
router.delete('/:commentID', isLoggedIn, isCommentAuthor, deleteComment)

module.exports = router