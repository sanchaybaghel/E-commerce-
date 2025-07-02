#!/usr/bin/env node

/**
 * Helper script to encode Firebase service account key for deployment
 * Usage: node scripts/encode-firebase-key.js path/to/serviceAccountKey.json
 */

const fs = require('fs');
const path = require('path');

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node scripts/encode-firebase-key.js path/to/serviceAccountKey.json');
  process.exit(1);
}

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

try {
  // Read the JSON file
  const serviceAccountKey = fs.readFileSync(filePath, 'utf8');
  
  // Validate JSON
  JSON.parse(serviceAccountKey);
  
  // Encode to base64
  const encoded = Buffer.from(serviceAccountKey).toString('base64');
  
  console.log('✅ Firebase service account key encoded successfully!');
  console.log('\n📋 Copy this value to your FIREBASE_SERVICE_ACCOUNT_KEY environment variable:');
  console.log('\n' + encoded);
  console.log('\n⚠️  Make sure to keep this value secure and never commit it to version control!');
  
} catch (error) {
  console.error('Error processing file:', error.message);
  process.exit(1);
}
