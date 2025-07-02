#!/usr/bin/env node

/**
 * Helper script to extract individual Firebase service account components
 * This provides an alternative to the base64-encoded full JSON approach
 * Usage: node scripts/extract-firebase-components.js path/to/serviceAccountKey.json
 */

const fs = require('fs');

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node scripts/extract-firebase-components.js path/to/serviceAccountKey.json');
  process.exit(1);
}

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

try {
  // Read and parse the JSON file
  const serviceAccountKey = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log('✅ Firebase service account components extracted successfully!');
  console.log('\n📋 Add these individual environment variables to Render:');
  console.log('\n--- Individual Firebase Environment Variables ---');
  console.log(`FIREBASE_PROJECT_ID=${serviceAccountKey.project_id}`);
  console.log(`FIREBASE_CLIENT_EMAIL=${serviceAccountKey.client_email}`);
  console.log('\n--- Private Key (copy this exactly) ---');
  console.log('FIREBASE_PRIVATE_KEY=');
  console.log(serviceAccountKey.private_key);
  console.log('\n⚠️  When setting FIREBASE_PRIVATE_KEY in Render:');
  console.log('1. Copy the entire private key including the BEGIN/END lines');
  console.log('2. Make sure all newlines are preserved');
  console.log('3. This approach often works better than base64 encoding');
  
} catch (error) {
  console.error('Error processing file:', error.message);
  process.exit(1);
}
