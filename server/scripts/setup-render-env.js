#!/usr/bin/env node

/**
 * Script to help set up Render environment variables for Firebase
 * This script outputs the exact format needed for Render environment variables
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Firebase Environment Variables Setup for Render\n');

try {
  // Read the local service account key
  const serviceAccountPath = path.join(__dirname, '../config/serviceAccountKey.json');
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  console.log('📋 Copy these environment variables to your Render dashboard:\n');
  
  console.log('FIREBASE_PROJECT_ID');
  console.log(serviceAccount.project_id);
  console.log('');
  
  console.log('FIREBASE_CLIENT_EMAIL');
  console.log(serviceAccount.client_email);
  console.log('');
  
  console.log('FIREBASE_PRIVATE_KEY');
  console.log('(Copy the private key exactly as shown below, including all newlines)');
  console.log('');
  console.log(serviceAccount.private_key);
  console.log('');
  
  console.log('⚠️  IMPORTANT NOTES:');
  console.log('1. When pasting FIREBASE_PRIVATE_KEY in Render:');
  console.log('   - Include the -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY----- lines');
  console.log('   - Preserve all newlines (don\'t put it all on one line)');
  console.log('   - Don\'t add any extra quotes or formatting');
  console.log('');
  console.log('2. After setting these variables, your deployment should show:');
  console.log('   "Using individual Firebase environment variables..."');
  console.log('   "Firebase Admin SDK initialized successfully"');
  console.log('');
  console.log('3. If you still get DECODER errors, the issue might be with how');
  console.log('   Render handles multi-line environment variables.');
  
} catch (error) {
  console.error('❌ Error reading service account key:', error.message);
  console.log('');
  console.log('Make sure you have the serviceAccountKey.json file in server/config/');
}
