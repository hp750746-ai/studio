'use client';

import {
    Auth,
    signInWithPopup,
    GoogleAuthProvider,
    UserCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';


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

/** Initiate user profile update (non-blocking). */
export function initiateProfileUpdate(
  authInstance: Auth,
  displayName: string,
  onSuccess: () => void,
  onError: (error: FirebaseError) => void
): void {
  if (!authInstance.currentUser) {
    onError(new FirebaseError('auth/no-user', 'No user is currently signed in.'));
    return;
  }
  updateProfile(authInstance.currentUser, { displayName })
    .then(onSuccess)
    .catch(onError);
}
