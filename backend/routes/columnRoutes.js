const express = require('express')
const router = express.Router({ mergeParams: true });
const { allColumns, createColumn, deleteColumn, updateColumn } = require('../controllers/Columns')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware/auth')
const { validateColumn } = require('../middleware/middleware')


router.get('/:boardId', catchAsync(allColumns))

router.post('/', isLoggedIn, validateColumn, catchAsync(createColumn))

router.put('/:id', isLoggedIn, validateColumn, catchAsync(updateColumn))


router.delete('/:id', isLoggedIn, catchAsync(deleteColumn))

module.exports = router;