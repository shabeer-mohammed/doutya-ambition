// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQnA1-Qed1K_n3KS03rQuTtcHMi21ht2E",
  authDomain: "wowfy-dde3b.firebaseapp.com",
  projectId: "wowfy-dde3b",
  storageBucket: "wowfy-dde3b.appspot.com",
  messagingSenderId: "863118669104",
  appId: "1:863118669104:web:18d3efae6c2a3e4563c4f5",
  measurementId: "G-DKMP048NXW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Check if the browser supports Firebase Messaging
if ("serviceWorker" in navigator && "PushManager" in window) {
  // Initialize Firebase Messaging
  const messaging = getMessaging(app);
  // Use Firebase Messaging as needed
} else {
  console.error("Firebase Messaging is not supported in this browser.");
}

export const usersCollectionRef = collection(db, "users");
