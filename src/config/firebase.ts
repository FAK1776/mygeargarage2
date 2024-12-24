import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC2P8su381IeMd21AnRn-rwsFfULZoG2BM",
  authDomain: "my-gear-garage.firebaseapp.com",
  projectId: "my-gear-garage",
  storageBucket: "my-gear-garage.appspot.com",
  messagingSenderId: "724193199225",
  appId: "1:724193199225:web:22fc1ca574753a134e80a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence configured');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// Initialize Firestore
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .then(() => {
    console.log('Firestore persistence enabled');
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage }; 