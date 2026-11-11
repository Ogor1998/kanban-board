const express = require('express')
const router = express.Router({ mergeParams: true });
const { allColumns, createColumn, deleteColumn, updateColumn } = require('../controllers/Columns')
const { catchAsync } = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware/auth')
const { validateColumn, isBoardMember, isBoardOwner, canAccessBoardFromBody, canAccessColumn } = require('../middleware/middleware')


router.get('/:boardId', isLoggedIn, catchAsync(allColumns))

router.post('/', isLoggedIn, canAccessBoardFromBody, validateColumn, catchAsync(createColumn))

router.put('/:id', isLoggedIn, canAccessColumn, validateColumn, catchAsync(updateColumn))


router.delete('/:id', isLoggedIn, canAccessColumn, catchAsync(deleteColumn))

module.exports = router;