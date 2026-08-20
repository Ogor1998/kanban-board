
const express = require('express')
const router = express.Router({ mergeParams: true });
const { createCard, deleteCard, moveCard, updateCard } = require('../controllers/Cards')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/auth');
const { validateCard } = require('../middleware/middleware')
const { upload } = require('../cloudinary')

router.post('/', isLoggedIn, validateCard, upload.array('images', 10), catchAsync(createCard))


router.delete('/:id', isLoggedIn, catchAsync(deleteCard))

router.put('/:id', validateCard, upload.array('images', 10), catchAsync(updateCard))

router.patch('/:id/move', isLoggedIn, catchAsync(moveCard))


module.exports = router;