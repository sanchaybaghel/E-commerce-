const express = require('express');
const { syncUser } = require('../controllers/authController');
const firebaseAuth = require('../middleware/auth');

const router = express.Router();

// This route is protected by Firebase token verification

router.post('/sync-user', firebaseAuth, syncUser);

// Set cookie with token (for login)
router.post('/set-cookie', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'No token provided' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // set to true in production
    sameSite: 'lax', // or 'strict'
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  });
  res.json({ message: 'Cookie set' });
});

// Logout route to clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out' });
});

module.exports = router;