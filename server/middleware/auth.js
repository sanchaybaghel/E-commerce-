const { verifyIdToken, isInitialized } = require('../config/firebase-client');

const firebaseAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = await verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Firebase auth error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = firebaseAuth;