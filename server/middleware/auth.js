const { verifyIdToken, isInitialized } = require('../config/firebase-client');

const firebaseAuth = async (req, res, next) => {
 
  if (!isInitialized()) {
    return res.status(500).json({ message: 'Firebase not properly configured on the server.' });
  }
 
 // const token =req.headers.authorization?.split(' ')[1];
  //console.log("token.header",req.headers.authorization)
  const token=req.headers.authorization?.split(' ')[1] || req.cookies.token
  
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
   // console.log("token",token)
    const decoded = await verifyIdToken(token);
   // console.log("decoded",decoded)
    req.user = decoded;
    next();
  } catch (err) {
    console.log("err",err.message)
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = firebaseAuth;