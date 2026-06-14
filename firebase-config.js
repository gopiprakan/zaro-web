// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBefJKwkR1gWbvb2U6vvKu1iykhmapkDio",
  authDomain: "zaro-4756c.firebaseapp.com",
  projectId: "zaro-4756c",
  storageBucket: "zaro-4756c.firebasestorage.app",
  messagingSenderId: "965541921452",
  appId: "1:965541921452:web:32b5c2faf6af2f7d575509"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
