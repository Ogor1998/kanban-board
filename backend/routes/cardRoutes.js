
const express = require('express')
const router = express.Router({ mergeParams: true });
const { createCard, deleteCard, moveCard, updateCard } = require('../controllers/Cards')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/auth');
const { validateCard } = require('../middleware/middleware')

router.post('/', isLoggedIn, validateCard, catchAsync(createCard))


router.delete('/:id', isLoggedIn, catchAsync(deleteCard))

router.put('/:id', validateCard, catchAsync(updateCard))

router.patch('/:id/move', isLoggedIn, catchAsync(moveCard))


module.exports = router;