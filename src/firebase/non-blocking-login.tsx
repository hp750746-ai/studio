'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  FirebaseError,
  sendPasswordResetEmail,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch((error) => {
    console.error('Anonymous sign-in failed:', error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(
  authInstance: Auth,
  email: string,
  password: string,
  fullName: string,
  onSuccess?: () => void,
  onError?: (error: FirebaseError) => void
): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then((userCredential) => {
      if (userCredential.user) {
        updateProfile(userCredential.user, {
          displayName: fullName,
        })
        .then(() => {
          onSuccess?.();
        })
        .catch((profileError) => {
          console.error('Profile update failed, but user created:', profileError);
          onSuccess?.(); // Still call success as the user is created
        });
      } else {
        onSuccess?.();
      }
    })
    .catch((error: FirebaseError) => {
      onError ? onError(error) : console.error('Sign-up failed:', error);
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(
  authInstance: Auth,
  email: string,
  password: string,
  onSuccess?: () => void,
  onError?: (error: FirebaseError) => void
): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .then(() => {
      onSuccess?.();
    })
    .catch((error: FirebaseError) => {
      onError ? onError(error) : console.error('Sign-in failed:', error);
    });
}

/** Initiate password reset email (non-blocking). */
export function initiatePasswordReset(
  authInstance: Auth,
  email: string,
  onSuccess?: () => void,
  onError?: (error: FirebaseError) => void
): void {
  sendPasswordResetEmail(authInstance, email)
    .then(() => {
      onSuccess?.();
    })
    .catch((error: FirebaseError) => {
      onError ? onError(error) : console.error('Password reset failed:', error);
    });
}
