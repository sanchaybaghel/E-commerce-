const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    console.log('Parsing Firebase service account key from environment variable...');
    const decodedKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString();
    console.log('Decoded key length:', decodedKey.length);
    serviceAccount = JSON.parse(decodedKey);

    // Fix private key formatting - handle multiple formatting issues
    if (serviceAccount.private_key) {
      let privateKey = serviceAccount.private_key;

      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');

      // Remove any extra whitespace or characters
      privateKey = privateKey.trim();

      // Ensure proper PEM format and fix common issues
      if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
        console.error('Private key does not start with proper PEM header');
        console.log('Private key starts with:', privateKey.substring(0, 50));
      }
      if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
        console.error('Private key does not end with proper PEM footer');
        console.log('Private key ends with:', privateKey.substring(privateKey.length - 50));

        // Try to fix truncated private key
        if (!privateKey.includes('-----END PRIVATE KEY-----')) {
          console.log('Attempting to fix truncated private key...');
          if (privateKey.endsWith('-----END PRIVATE KEY---')) {
            privateKey += '--';
          } else if (privateKey.endsWith('-----END PRIVATE KEY-')) {
            privateKey += '----';
          } else if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
            privateKey += '\n-----END PRIVATE KEY-----';
          }
        }
      }

      serviceAccount.private_key = privateKey;
      console.log('Private key length after formatting:', privateKey.length);
      console.log('Private key formatting completed');
    }

    console.log('Service account parsed successfully. Project ID:', serviceAccount.project_id);
  } catch (error) {
    console.error('Error parsing Firebase service account key:', error.message);
    console.error('Make sure FIREBASE_SERVICE_ACCOUNT_KEY is a valid base64-encoded JSON string');
    process.exit(1);
  }
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  // Alternative: use individual environment variables (often more reliable)
  console.log('Using individual Firebase environment variables...');
  let privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').trim();

  // Ensure proper PEM format
  if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
    privateKey = '-----BEGIN PRIVATE KEY-----\n' + privateKey;
  }
  if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
    privateKey = privateKey + '\n-----END PRIVATE KEY-----';
  }

  serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };
  console.log('Individual environment variables configured successfully');
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