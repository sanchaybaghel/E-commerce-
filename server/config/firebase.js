const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    console.log('Parsing Firebase service account key from environment variable...');
    const decodedKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString();
    console.log('Decoded key length:', decodedKey.length);
    serviceAccount = JSON.parse(decodedKey);
    console.log('Service account parsed successfully. Project ID:', serviceAccount.project_id);
  } catch (error) {
    console.error('Error parsing Firebase service account key:', error.message);
    console.error('Make sure FIREBASE_SERVICE_ACCOUNT_KEY is a valid base64-encoded JSON string');
    process.exit(1);
  }
} else {
  // For development: use local service account key file
  try {
    serviceAccount = require('./serviceAccountKey.json');
    console.log('Using local service account key file');
  } catch (error) {
    console.error('Service account key not found. Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable for production.');
    process.exit(1);
  }
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
  process.exit(1);
}

module.exports = admin;