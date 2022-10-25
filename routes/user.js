const express = require('express');
const router = express.Router();
const {
Login_user,
Signup_user
} = require('../controllers/userController')

//login routes
router.post('/login', Login_user)

//signup routes
router.post('/signup',Signup_user)

module.exports = router