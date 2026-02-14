'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(auth: Auth, onSuccess: () => void, onError: (error: FirebaseError) => void): void {
  signInAnonymously(auth)
    .then(() => {
        onSuccess();
    })
    .catch((error: FirebaseError) => {
        onError(error);
    });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(auth: Auth, email: string, password: string, fullName: string, onSuccess: () => void, onError: (error: FirebaseError) => void): void {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // After user is created, update their profile with the full name
      return updateProfile(userCredential.user, { displayName: fullName });
    })
    .then(() => {
      onSuccess();
    })
    .catch((error: FirebaseError) => {
      onError(error);
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(auth: Auth, email: string, password: string, onSuccess: () => void, onError: (error: FirebaseError) => void): void {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      onSuccess();
    })
    .catch((error: FirebaseError) => {
      onError(error);
    });
}

/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(auth: Auth, onSuccess: () => void, onError: (error: FirebaseError) => void): void {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      onSuccess();
    })
    .catch((error: FirebaseError) => {
      onError(error);
    });
}

/** Initiate password reset email (non-blocking). */
export function initiatePasswordReset(auth: Auth, email: string, onSuccess: () => void, onError: (error: FirebaseError) => void): void {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      onSuccess();
    })
    .catch((error: FirebaseError) => {
      onError(error);
    });
}
