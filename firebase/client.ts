// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCopl5Uv06aCfxqzpdTk0BitYvIAZ_M1jw",
  authDomain: "hireprep-628f2.firebaseapp.com",
  projectId: "hireprep-628f2",
  storageBucket: "hireprep-628f2.firebasestorage.app",
  messagingSenderId: "871452034709",
  appId: "1:871452034709:web:88b15fdc367473a1217d9c",
  measurementId: "G-V1H28WQCYX"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);