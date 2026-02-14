'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth,
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(
  authInstance: Auth,
  onSuccess: (user: UserCredential) => void,
  onError: (error: FirebaseError) => void
): void {
  const provider = new GoogleAuthProvider();
  signInWithPopup(authInstance, provider).then(onSuccess).catch(onError);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(
  authInstance: Auth,
  email: string,
  password: string,
  fullName: string,
  onSuccess: (user: UserCredential) => void,
  onError: (error: FirebaseError) => void
): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then((userCredential) => {
        // After creating the user, update their profile with the full name
        return updateProfile(userCredential.user, { displayName: fullName })
            .then(() => onSuccess(userCredential)); // Call onSuccess after profile is updated
    })
    .catch(onError);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(
  authInstance: Auth,
  email: string,
  password: string,
  onSuccess: (user: UserCredential) => void,
  onError: (error: FirebaseError) => void
): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .then(onSuccess)
    .catch(onError);
}

/** Initiate password reset (non-blocking). */
export function initiatePasswordReset(
  authInstance: Auth,
  email: string,
  onSuccess: () => void,
  onError: (error: FirebaseError) => void
): void {
  sendPasswordResetEmail(authInstance, email)
    .then(onSuccess)
    .catch(onError);
}


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';