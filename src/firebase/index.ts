import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
 
// const { VITE_FIREBASE_CONFIG } = import.meta.env;
 
// if (!VITE_FIREBASE_CONFIG) {
//   throw new Error('Firebase config is missing!');
// }
 
const firebaseConfig={
  apiKey: "AIzaSyBWRJMJaYe1ktgqAXn8IMTF02FiAa6nqvg",
  authDomain: "backendtest-af756.firebaseapp.com",
  projectId: "backendtest-af756",
  storageBucket: "backendtest-af756.appspot.com",
  messagingSenderId: "896050025006",
  appId: "1:896050025006:web:8f8051c87841c32f5a05bf"};
 
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
 
export const firebaseAuth = getAuth(app);