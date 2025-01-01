import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Detailed debug logging
console.log('Environment Mode:', import.meta.env.MODE);
console.log('Firebase Config Details:', {
  apiKey: {
    exists: Boolean(firebaseConfig.apiKey),
    length: firebaseConfig.apiKey?.length || 0
  },
  authDomain: {
    exists: Boolean(firebaseConfig.authDomain),
    value: firebaseConfig.authDomain
  },
  projectId: {
    exists: Boolean(firebaseConfig.projectId),
    value: firebaseConfig.projectId
  },
  storageBucket: {
    exists: Boolean(firebaseConfig.storageBucket),
    value: firebaseConfig.storageBucket
  },
  messagingSenderId: {
    exists: Boolean(firebaseConfig.messagingSenderId),
    value: firebaseConfig.messagingSenderId
  },
  appId: {
    exists: Boolean(firebaseConfig.appId),
    length: firebaseConfig.appId?.length || 0
  }
});

// Validate configuration
const validateConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }
};

try {
  validateConfig();
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
} 