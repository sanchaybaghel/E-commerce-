const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  
  serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
} else {
  // For development: use local service account key file
  try {
    serviceAccount = require('./serviceAccountKey.json');
  } catch (error) {
    console.error('Service account key not found. Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable for production.');
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;