import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVDepWRlZ7_f5FysW3mv5FaU_l2hehWss",
  authDomain: "fir-crud-app-1f464.firebaseapp.com",
  projectId: "fir-crud-app-1f464",
  storageBucket: "fir-crud-app-1f464.appspot.com",
  messagingSenderId: "153501872010",
  appId: "1:153501872010:web:ed70cf54fc8fab4134e273",
  measurementId: "G-V0JCBRY9Y0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
