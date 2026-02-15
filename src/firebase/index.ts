'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth,
  Auth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

export {
    initiateGoogleSignIn,
    initiateEmailSignUp,
    initiateEmailSignIn,
    initiatePasswordReset,
} from './auth-helpers';
export { FirebaseProvider } from './provider';
export type { FirebaseContextState } from './provider';
export {
    useFirebase,
    useAuth,
    useFirestore,
    useFirebaseApp,
    useMemoFirebase,
    useUser
} from './hooks';
export type { FirebaseServicesAndUser, UserHookResult } from './hooks';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export type { UseCollectionResult, WithId, InternalQuery } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export type { UseDocResult } from './firestore/use-doc';
export {
    setDocumentNonBlocking,
    addDocumentNonBlocking,
    updateDocumentNonBlocking,
    deleteDocumentNonBlocking
} from './non-blocking-updates';
export { FirestorePermissionError } from './errors';
export type { SecurityRuleContext } from './errors';
export { errorEmitter } from './error-emitter';
export type { AppEvents } from './error-emitter';
