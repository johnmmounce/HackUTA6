// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIcBFFjEOJwseuukk8MOGxJbWphFbgl1o",
  authDomain: "whatsmydamage-dd0fb.firebaseapp.com",
  projectId: "whatsmydamage-dd0fb",
  storageBucket: "whatsmydamage-dd0fb.appspot.com",
  messagingSenderId: "664388292106",
  appId: "1:664388292106:web:466311bcf6efebe21999f3",
  measurementId: "G-KF5SMR3L64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional, if you're using analytics)
const analytics = getAnalytics(app);

// Initialize Firestore (for database operations)
const db = getFirestore(app);

// Initialize Firebase Authentication (for user authentication)
const auth = getAuth(app);

// Export the initialized instances
export { app, analytics, db, auth };
