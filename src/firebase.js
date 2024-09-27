// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCg38s3EOlPFsek5P9wIqPiJvVid5_ByOE",
  authDomain: "arquitectura-39125.firebaseapp.com",
  projectId: "arquitectura-39125",
  storageBucket: "arquitectura-39125.appspot.com",
  messagingSenderId: "355250082886",
  appId: "1:355250082886:web:7df84a9cbe3bbcb2812647",
  measurementId: "G-04QQ3YP96V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);
export const db = getFirestore(app);