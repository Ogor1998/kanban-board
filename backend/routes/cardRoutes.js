
const express = require('express')
const router = express.Router({ mergeParams: true });
const {
    createCard,
    deleteCard,
    moveCard,
    updateCard,
    addMember,
    deleteMember,
    checklist,
    toggleChecklist,
    deleteItem } = require('../controllers/Cards')
const { catchAsync } = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/auth');
const { validateCard, isCardMember, isBoardMember, canAccessCard, canAccessColumnFromBody } = require('../middleware/middleware')
const { upload } = require('../cloudinary')

router.post('/', isLoggedIn, upload.array('images', 10), canAccessColumnFromBody, validateCard, catchAsync(createCard))


router.delete('/:id', isLoggedIn, canAccessCard, catchAsync(deleteCard))

router.put('/:id', isLoggedIn, upload.array('images', 10), validateCard, catchAsync(updateCard))
router.post('/:cardId/checklist', isLoggedIn, catchAsync(checklist))
router.patch('/:cardId/checklist/:itemId', isLoggedIn, canAccessCard, catchAsync(toggleChecklist))
router.delete('/:cardId/checklist/:itemId', isLoggedIn, canAccessCard, catchAsync(deleteItem))


router.put('/:cardId/invite', isLoggedIn, isCardMember, catchAsync(addMember))
router.delete('/:cardId/member/:memberID', isLoggedIn, canAccessCard, catchAsync(deleteMember))

router.patch('/:activeId/move', isLoggedIn, canAccessCard, catchAsync(moveCard))


module.exports = router;