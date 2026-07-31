
const express = require('express')
const router = express.Router({ mergeParams: true });
const { createCard, deleteCard, moveCard } = require('../controllers/Cards')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/auth');

router.post('/cards', isLoggedIn, catchAsync(createCard))


router.delete('/cards/:id', isLoggedIn, catchAsync(deleteCard))


router.patch('/cards/:id/move', isLoggedIn, catchAsync(moveCard))


module.exports = router;