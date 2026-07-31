const express = require('express')
const router = express.Router({ mergeParams: true });
const { allColumns, createColumn, deleteColumn, updateColumn } = require('../controllers/Columns')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware/auth')

router.get('/:boardId', catchAsync(allColumns))

router.post('/', isLoggedIn, catchAsync(createColumn))

router.put('/:id', isLoggedIn, catchAsync(updateColumn))


router.delete('/:id', isLoggedIn, catchAsync(deleteColumn))

module.exports = router;