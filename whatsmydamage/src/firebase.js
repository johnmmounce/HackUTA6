// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);