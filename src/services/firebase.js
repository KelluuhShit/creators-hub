// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDdEVyEAs8BUzNPmvKPEz1yZSAmyAXxc_E",
  authDomain: "creators-hub-222d9.firebaseapp.com",
  projectId: "creators-hub-222d9",
  storageBucket: "creators-hub-222d9.firebasestorage.app",
  messagingSenderId: "339319855160",
  appId: "1:339319855160:web:b23715920f049c20a06ecd",
  measurementId: "G-GM388586YG"
};

let app, analytics, auth, googleProvider;

try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully:', app.name);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  throw new Error('Failed to initialize Firebase: ' + error.message);
}

export { auth, googleProvider, analytics };