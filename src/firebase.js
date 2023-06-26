import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBzSWN5L6VTTxcbMOCJ6nkkiruA1nxf8YY",
  authDomain: "chatr-e9647.firebaseapp.com",
  projectId: "chatr-e9647",
  storageBucket: "chatr-e9647.appspot.com",
  messagingSenderId: "167221817516",
  appId: "1:167221817516:web:784fde2f7fb0762b456f09",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
