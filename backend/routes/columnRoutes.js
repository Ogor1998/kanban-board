const express = require('express')
const router = express.Router({ mergeParams: true });
const { allColumns, createColumn, deleteColumn, updateColumn } = require('../controllers/Columns')
const catchAsync = require('../utils/catchAsync')

router.get('/:boardId', catchAsync(allColumns))

router.post('/', catchAsync(createColumn))

router.put('/:id', catchAsync(updateColumn))


router.delete('/:id', catchAsync(deleteColumn))

module.exports = router;