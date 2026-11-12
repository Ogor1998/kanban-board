const express = require('express')
const router = express.Router();
const { allComments, commentCount, createComment, deleteComment } = require('../controllers/Comments')
const { isLoggedIn } = require('../middleware/auth')
const { isCommentAuthor, canAccessComments } = require('../middleware/middleware')
const { catchAsync } = require('../utils/catchAsync')

router.get('/:cardID', isLoggedIn, canAccessComments, catchAsync(allComments))

router.get('/:cardID/count', isLoggedIn, canAccessComments, catchAsync(commentCount))

router.post('/', isLoggedIn, canAccessComments, catchAsync(createComment))
router.delete('/:commentID', isLoggedIn, isCommentAuthor, catchAsync(deleteComment))

module.exports = router