import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

let cachedAuth: Auth | null = null;

function ensureApp(): FirebaseApp {
  if (getApps().length) return getApp();

  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}

export function getFirebaseAuth(): Auth {
  if (!cachedAuth) {
    cachedAuth = getAuth(ensureApp());
  }
  return cachedAuth;
}
