const express = require('express')
const router = express.Router();
const { validateUser } = require('../middleware/middleware')
const { login, register } = require('../controllers/Users')

router.post('/register', validateUser, register)
router.post('/login', login)



module.exports = router;