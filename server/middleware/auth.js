const { verifyIdToken, isInitialized } = require('../config/firebase-client');

const firebaseAuth = async (req, res, next) => {
  if (!isInitialized()) {
    return res.status(500).json({ message: 'Firebase not properly configured on the server.' });
  }
  // Try to get token from cookie first, fallback to header
  console.log("token",req.cookies)
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = await verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = firebaseAuth;