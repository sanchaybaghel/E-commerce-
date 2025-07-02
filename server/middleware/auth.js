const { admin, isInitialized } = require('../config/firebase');

const firebaseAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  // Check if Firebase is initialized
  if (!isInitialized()) {
    return res.status(503).json({
      message: 'Firebase authentication service is not available',
      error: 'Firebase Admin SDK not initialized'
    });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = firebaseAuth;