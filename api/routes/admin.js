const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')
const auth = require('../util/auth')

router.post('/login', adminController.validate.userLogin, adminController.login)
router.post('/logout', auth.required, adminController.logout)

router.get('/me', auth.required, adminController.me)

module.exports = router