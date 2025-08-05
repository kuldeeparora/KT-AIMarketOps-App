import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration for kent-traders-admin
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAij1znsXy4Vab35Aat7AqS1FKM_5l0O_4',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'kent-traders-admin.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'kent-traders-admin',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'kent-traders-admin.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '477539074489',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:477539074489:web:d1e9f99bbbf80851833668',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-Y6271ERDXY'
};

// Initialize Firebase only if we have valid config
let app = null;
let auth = null;
let db = null;
let storage = null;
let analytics = null;

try {
  // Check if we have the minimum required config
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'mock-api-key') {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Initialize Analytics only in browser
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
  } else {
    console.warn('Firebase not initialized: Missing environment variables');
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
}

export { auth, db, storage, analytics };
export default app;
