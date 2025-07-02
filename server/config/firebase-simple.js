// Simple Firebase configuration that bypasses Admin SDK private key issues
// This uses JWT verification without requiring the problematic private key parsing

const jwt = require('jsonwebtoken');
const axios = require('axios');

let firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'e-commerce-project-c6e7a',
  initialized: false
};

// Simple Firebase token verification using Google's public keys
async function verifyFirebaseToken(idToken) {
  try {
    // Get Google's public keys
    const response = await axios.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    const publicKeys = response.data;
    
    // Decode the token header to get the key ID
    const decodedHeader = jwt.decode(idToken, { complete: true });
    if (!decodedHeader || !decodedHeader.header.kid) {
      throw new Error('Invalid token header');
    }
    
    const publicKey = publicKeys[decodedHeader.header.kid];
    if (!publicKey) {
      throw new Error('Public key not found');
    }
    
    // Verify the token
    const decoded = jwt.verify(idToken, publicKey, {
      algorithms: ['RS256'],
      audience: firebaseConfig.projectId,
      issuer: `https://securetoken.google.com/${firebaseConfig.projectId}`
    });
    
    return decoded;
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
}

// Initialize simple Firebase configuration
function initializeFirebase() {
  if (process.env.FIREBASE_PROJECT_ID) {
    firebaseConfig.projectId = process.env.FIREBASE_PROJECT_ID;
    firebaseConfig.initialized = true;
    console.log('✅ Simple Firebase configuration initialized successfully');
    console.log('Project ID:', firebaseConfig.projectId);
    return true;
  } else {
    console.log('⚠️  Firebase not configured - authentication will be disabled');
    return false;
  }
}

// Initialize on module load
const initialized = initializeFirebase();

module.exports = {
  verifyToken: verifyFirebaseToken,
  isInitialized: () => firebaseConfig.initialized,
  projectId: firebaseConfig.projectId,
  initialized
};
