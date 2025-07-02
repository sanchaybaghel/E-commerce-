#!/usr/bin/env node

/**
 * Test script to validate Firebase private key format
 * Usage: node scripts/test-firebase-key.js
 */

require('dotenv').config();
const crypto = require('crypto');

function testPrivateKey(privateKey, source) {
  console.log(`\n=== Testing Private Key from ${source} ===`);
  console.log('Length:', privateKey.length);
  console.log('Starts with:', privateKey.substring(0, 30));
  console.log('Ends with:', privateKey.substring(privateKey.length - 30));
  
  // Test if it's a valid PEM format
  try {
    const keyObject = crypto.createPrivateKey(privateKey);
    console.log('✅ Private key is valid!');
    console.log('Key type:', keyObject.asymmetricKeyType);
    console.log('Key size:', keyObject.asymmetricKeySize);
    return true;
  } catch (error) {
    console.log('❌ Private key validation failed:', error.message);
    return false;
  }
}

// Test base64 encoded key
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const decodedKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString();
    const serviceAccount = JSON.parse(decodedKey);
    let privateKey = serviceAccount.private_key.replace(/\\n/g, '\n');
    testPrivateKey(privateKey, 'Base64 Encoded JSON');
  } catch (error) {
    console.log('❌ Failed to parse base64 key:', error.message);
  }
}

// Test individual environment variables
if (process.env.FIREBASE_PRIVATE_KEY) {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  testPrivateKey(privateKey, 'Individual Environment Variable');
}

// Test local file
try {
  const serviceAccount = require('../config/serviceAccountKey.json');
  testPrivateKey(serviceAccount.private_key, 'Local JSON File');
} catch (error) {
  console.log('❌ Local file not found or invalid');
}

console.log('\n=== Recommendations ===');
console.log('1. Use individual environment variables if base64 fails');
console.log('2. Ensure private key includes BEGIN/END lines');
console.log('3. Check for truncation in environment variable values');
console.log('4. Verify newlines are properly preserved');
