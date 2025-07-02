const express = require('express');
const firebaseAuth = require('../middleware/auth');

const router = express.Router();

// Protected route example
router.get('/profile', firebaseAuth, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

module.exports = router ;