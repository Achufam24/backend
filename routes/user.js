const express = require('express');
const router = express.Router();
const {
Login_user,
Signup_user,
complete_profile,
fetch_user
} = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

//login routes
router.post('/login', Login_user);

//signup routes
router.post('/signup',Signup_user);

//update profile
router.put('/complete-profile', requireAuth, complete_profile);

//fetch user
router.get('/me', requireAuth, fetch_user);

module.exports = router