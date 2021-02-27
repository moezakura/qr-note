import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseApp = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});

const _db = firebaseApp.firestore();
const _auth = firebaseApp.auth();
const _storage = firebase.storage();
if (process.env.NODE_ENV === 'local') {
  _auth.useEmulator('http://localhost:9099');
  _db.useEmulator('localhost', 8080);
}

export const db = _db;
export const auth = _auth;
export const storage = _storage;
