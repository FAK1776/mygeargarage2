import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2P8su381IeMd21AnRn-rwsFfULZoG2BM",
  authDomain: "my-gear-garage.firebaseapp.com",
  projectId: "my-gear-garage",
  storageBucket: "my-gear-garage.firebasestorage.app",
  messagingSenderId: "724193199225",
  appId: "1:724193199225:web:22fc1ca574753a134e80a8",
  measurementId: "G-C1DL0QH9WM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Initialize Auth with persistence
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence configured');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

// Initialize Firestore with persistence
export const db = getFirestore(app);
enableIndexedDbPersistence(db)
  .then(() => {
    console.log('Firestore persistence enabled');
  })
  .catch((error) => {
    console.error('Error enabling Firestore persistence:', error);
  });

// Set up auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Auth state changed: User is signed in');
    // Force token refresh
    user.getIdToken(true)
      .then(() => console.log('Auth token refreshed'))
      .catch(error => console.error('Error refreshing token:', error));
  } else {
    console.log('Auth state changed: User is signed out');
  }
});

export const storage = getStorage(app);
export default app; 