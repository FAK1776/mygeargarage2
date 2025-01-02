import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Debug logging for environment
console.log('Environment Mode:', import.meta.env.MODE);
console.log('Environment Variables Present:', {
  VITE_FIREBASE_API_KEY: !!import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: !!import.meta.env.VITE_FIREBASE_APP_ID
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate config before initialization
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration keys:', missingKeys);
  throw new Error(`Firebase configuration is incomplete. Missing: ${missingKeys.join(', ')}`);
}

// Initialize Firebase
try {
  console.log('Initializing Firebase with config:', {
    apiKey: firebaseConfig.apiKey ? 'present' : 'missing',
    authDomain: firebaseConfig.authDomain ? 'present' : 'missing',
    projectId: firebaseConfig.projectId ? 'present' : 'missing',
    storageBucket: firebaseConfig.storageBucket ? 'present' : 'missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? 'present' : 'missing',
    appId: firebaseConfig.appId ? 'present' : 'missing'
  });
  
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
} 