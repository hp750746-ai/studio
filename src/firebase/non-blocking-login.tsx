'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance).catch((error) => {
    // This is not a Firestore error, so logging it is acceptable for debugging.
    console.error('Anonymous sign-in failed:', error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, fullName: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password)
    .then((userCredential) => {
      if (userCredential.user) {
        // Once the user is created, update their profile with the full name.
        // This is also non-blocking.
        updateProfile(userCredential.user, {
          displayName: fullName,
        });
      }
    })
    .catch((error) => {
      // This is not a Firestore error, so logging it is acceptable for debugging.
      // This helps diagnose issues like 'auth/email-already-in-use'.
      console.error('Sign-up failed:', error);
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password)
    .catch((error) => {
      // This is not a Firestore error, so logging it is acceptable for debugging.
      // This helps diagnose issues like 'auth/wrong-password' or 'auth/user-not-found'.
      console.error('Sign-in failed:', error);
    });
}
