import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
 
// const { VITE_FIREBASE_CONFIG } = import.meta.env;
 
// if (!VITE_FIREBASE_CONFIG) {
//   throw new Error('Firebase config is missing!');
// }
 
const firebaseConfig={
  apiKey: "AIzaSyBIXx5yUnz3vvr1fDGwCoZUtQXkAeUSX7U",
  authDomain: "sigaps-c1531.firebaseapp.com",
  projectId: "sigaps-c1531",
  storageBucket: "sigaps-c1531.appspot.com",
  messagingSenderId: "1052603529584",
  appId: "1:1052603529584:web:be3f6594b6428c12f677b5"};
 
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
 
export const firebaseAuth = getAuth(app);