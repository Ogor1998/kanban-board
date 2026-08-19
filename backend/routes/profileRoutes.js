const express = require('express')
const router = express.Router({ mergeParams: true });
const { upload } = require('../cloudinary')
const { findProfile, updateProfile } = require('../controllers/Profiles')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware/auth')



router.get('/:username', catchAsync(findProfile))

router.put('/', isLoggedIn, upload.single('image'), catchAsync(updateProfile))


module.exports = router;
