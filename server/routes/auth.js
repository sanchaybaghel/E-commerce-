const express = require('express');
const { syncUser } = require('../controllers/authController');
const firebaseAuth = require('../middleware/auth');

const router = express.Router();

// This route is protected by Firebase token verification
router.post('/sync-user', firebaseAuth, syncUser);

module.exports = router;