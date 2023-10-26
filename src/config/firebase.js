import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDfcDadivlx6_2Kp_7MqwFYikoHvHH9i1c",
  authDomain: "react-firebase-first-pro-69962.firebaseapp.com",
  projectId: "react-firebase-first-pro-69962",
  storageBucket: "react-firebase-first-pro-69962.appspot.com",
  messagingSenderId: "279469877828",
  appId: "1:279469877828:web:5c7ae8b1038891855f6a11",
  measurementId: "G-FDQZPBJMLZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);