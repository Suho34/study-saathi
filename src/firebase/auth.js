// src/firebase/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

// Sign up with email & password
export const signUpWithEmail = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login with email & password
export const loginWithEmail = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign in with Google
const googleProvider = new GoogleAuthProvider();
export const loginWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

// Logout
export const logoutUser = async () => {
  return signOut(auth);
};
