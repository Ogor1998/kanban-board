const express = require('express')
const router = express.Router();
const { validateUser } = require('../middleware/middleware')
const { login, register, findUsers } = require('../controllers/Users')

router.get('/users', findUsers)
router.post('/register', validateUser, register)
router.post('/login', login)



module.exports = router;