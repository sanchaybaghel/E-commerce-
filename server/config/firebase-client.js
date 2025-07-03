let axios;
try {
  axios = require('axios');
} catch (error) {
  console.log("error",error)
  console.log('⚠️  Axios not available, using fallback token validation only');
}

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'e-commerce-project-c6e7a',
  initialized: false
};

async function verifyFirebaseIdToken(idToken) {

  if (axios && process.env.FIREBASE_WEB_API_KEY) {
    try {

      const response = await axios.post(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${process.env.FIREBASE_WEB_API_KEY}`,
        { idToken: idToken },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.users && response.data.users.length > 0) {
        const user = response.data.users[0];
        return {
          uid: user.localId,
          email: user.email,
          email_verified: user.emailVerified === 'true',
          name: user.displayName || user.email.split('@')[0]
        };
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.log('Google API verification failed, using fallback...');
    }
  }

  console.log('Using fallback token validation...');
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('Invalid token format');
  }

  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token structure');
  }

  try {

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    if (!payload.aud || payload.aud !== firebaseConfig.projectId) {
      throw new Error('Invalid audience');
    }

    if (!payload.exp || payload.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }

    return {
      uid: payload.sub || payload.user_id,
      email: payload.email,
      email_verified: payload.email_verified || false,
      name: payload.name || payload.email?.split('@')[0] || 'User'
    };
  } catch (decodeError) {
    throw new Error('Token verification failed');
  }
}

function initializeFirebase() {
  // console.log("prces",process.env)
  // console.log("process.env.FIREBASE_PROJECT_ID",process.env.FIREBASE_PROJECT_ID)
  // console.log("process.env.FIREBASE_WEB_API_KEY",process.env.FIREBASE_WEB_API_KEY)
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_WEB_API_KEY) {
    firebaseConfig.projectId = process.env.FIREBASE_PROJECT_ID;
    firebaseConfig.initialized = true;
    return true;
  } else {
    console.log('⚠️  Firebase not fully configured. Authentication might be limited or fail.');
    firebaseConfig.initialized = false;
    return false;
  }
}

const initialized = initializeFirebase();

module.exports = {
  verifyIdToken: verifyFirebaseIdToken,
  isInitialized: () => firebaseConfig.initialized,
  projectId: firebaseConfig.projectId,
  initialized
};
