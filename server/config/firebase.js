const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with timeout protection
let serviceAccount;
let firebaseInitialized = false;

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

  // Create service account object with minimal processing
  serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
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
  // Additional validation before Firebase initialization
  if (serviceAccount.private_key) {
    const crypto = require('crypto');
    try {
      // Test if the private key can be parsed by Node.js crypto
      crypto.createPrivateKey(serviceAccount.private_key);
      console.log('Private key validation successful');
    } catch (cryptoError) {
      console.error('Private key crypto validation failed:', cryptoError.message);

      // Try to fix common DER parsing issues
      let fixedKey = serviceAccount.private_key;

      // Ensure proper line endings
      fixedKey = fixedKey.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

      // Remove any extra spaces or characters
      fixedKey = fixedKey.trim();

      // Ensure exactly one newline after header and before footer
      fixedKey = fixedKey.replace(/-----BEGIN PRIVATE KEY-----\s*/, '-----BEGIN PRIVATE KEY-----\n');
      fixedKey = fixedKey.replace(/\s*-----END PRIVATE KEY-----/, '\n-----END PRIVATE KEY-----');

      serviceAccount.private_key = fixedKey;

      // Test again
      try {
        crypto.createPrivateKey(serviceAccount.private_key);
        console.log('Private key fixed and validated successfully');
      } catch (secondError) {
        console.error('Unable to fix private key:', secondError.message);
        throw secondError;
      }
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  firebaseInitialized = true;
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
  console.error('This might be due to private key formatting issues');

  // Try alternative initialization methods for production
  if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_PROJECT_ID) {
    try {
      console.log('Attempting alternative Firebase initialization with application default credentials...');
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      firebaseInitialized = true;
      console.log('Firebase initialized with application default credentials');
    } catch (altError) {
      console.log('Application default credentials failed, trying project ID only...');
      try {
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
        firebaseInitialized = true;
        console.log('Firebase initialized with project ID only (limited functionality)');
      } catch (finalError) {
        console.error('All Firebase initialization methods failed');
        firebaseInitialized = false;
      }
    }
  } else {
    firebaseInitialized = false;
  }

  if (!firebaseInitialized) {
    // Don't exit the process - let the server start without Firebase for now
    console.log('⚠️  Server will continue without Firebase Admin SDK');
    console.log('Please check your Firebase configuration and restart');
  }
}

// Export admin with initialization status
module.exports = {
  admin,
  isInitialized: () => firebaseInitialized
};