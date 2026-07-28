
const express = require('express')
const router = express.Router({ mergeParams: true });
const { createCard, deleteCard, moveCard } = require('../controllers/Cards')
const catchAsync = require('../utils/catchAsync')

router.post('/cards', catchAsync(createCard))


router.delete('/cards/:id', catchAsync(deleteCard))


router.patch('/cards/:id/move', catchAsync(moveCard))


module.exports = router;