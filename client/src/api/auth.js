import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

// Login with Firebase
export const login = (email, password) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
};

// Register with Firebase
export const register = (email, password) => {
  const auth =  getAuth();

  return createUserWithEmailAndPassword(auth, email, password);
};

// Forgot password with Firebase
export const forgotPassword = (email) => {
  const auth = getAuth();
  return sendPasswordResetEmail(auth, email);
};


