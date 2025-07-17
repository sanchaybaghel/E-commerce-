const express = require('express');
const { syncUser,setCookie,logout } = require('../controllers/authController');
const firebaseAuth = require('../middleware/auth');

const router = express.Router();



router.post('/sync-user', firebaseAuth, syncUser);


router.post('/set-cookie',firebaseAuth,setCookie);
router.post('/logout',firebaseAuth,logout);

module.exports = router;