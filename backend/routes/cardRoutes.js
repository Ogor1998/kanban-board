
const express = require('express')
const router = express.Router({ mergeParams: true });
const { createCard, deleteCard, moveCard } = require('../controllers/Cards')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/auth');

router.post('/', isLoggedIn, catchAsync(createCard))


router.delete('/:id', isLoggedIn, catchAsync(deleteCard))


router.patch('/:id/move', isLoggedIn, catchAsync(moveCard))


module.exports = router;