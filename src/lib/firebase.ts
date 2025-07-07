import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCeDWWWlz_ucUU1dm7y6ZQM0nhJLmzIZc8",
  authDomain: "oltech-ai.firebaseapp.com",
  projectId: "oltech-ai",
  storageBucket: "oltech-ai.firebasestorage.app",
  messagingSenderId: "40318640500",
  appId: "1:40318640500:web:c3f34470f27787f9760c21",
  measurementId: "G-NSXTTBXJN3"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
