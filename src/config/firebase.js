import { initializeApp } from "firebase/app";
// import firebase from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
// import firebase from "firebase";
// import { Firestore } from "firebase/firestore";

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
export const database = {
  folders: collection(db, "folders"),
  files: collection(db, "files"),
  currentTimeStamp: serverTimestamp(),
};
export const formatter = {
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  },
};

export const operation = {
  // addFolderDoc: async ({ name, userId, parentId, createdTime }) => {
  //   const folderDocRef = await addDoc(database.folders, {
  //     name,
  //     userId,
  //     parentId,
  //     createdTime,
  //   });
  //   console.log(folderDocRef);
  // },
  // getFolderDoc: async (id) => {
  //   console.log("haan chal rha h ");
  //   const folderDoc = await getDoc(
  //     doc(database.folders, "m4YTWmJCKy5ji5UraJEI")
  //   );
  //   const folderDocData = await folderDoc.data();
  //   return folderDocData;
  // },
};

// export const database = {
//   folders: db.collection("folders"),
//   files: db.collection("files"),
// };

