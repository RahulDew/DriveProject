import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection } from "firebase/firestore";
// // for firebase crud
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

// // for stasherdrive-development
// const firebaseConfig = {
//   apiKey: "AIzaSyA1dfOEhKLJsbvljxCyrWYjCEbkaxv3nnM",
//   authDomain: "stasherdrive-development.firebaseapp.com",
//   projectId: "stasherdrive-development",
//   storageBucket: "stasherdrive-development.appspot.com",
//   messagingSenderId: "234739448710",
//   appId: "1:234739448710:web:85a25d0179bbbd6bc88a07",
// };

// // for stasherdrive-production


const firebaseConfig = {
  apiKey: "AIzaSyDSf1os6owTanvEOcYdpw95vua4A2R56LQ",
  authDomain: "stasherdrive-production.firebaseapp.com",
  projectId: "stasherdrive-production",
  storageBucket: "stasherdrive-production.appspot.com",
  messagingSenderId: "436224623508",
  appId: "1:436224623508:web:9e9243096388da7907c581",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = {
  folders: collection(db, "folders"),
  files: collection(db, "files"),
  users: collection(db, "users"),
  currentTimeStamp: serverTimestamp(),
};
export const formatter = {
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  },
};
