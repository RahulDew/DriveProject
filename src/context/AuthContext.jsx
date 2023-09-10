import React, { Children, createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { auth, googleProvider } from "../config/firebase";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);

  const signUp = async (email, password) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    //here we have to updateprofile and verify email of user when he/she sign Up
    // await updateProfile(auth.currentUser, {
    //   displayName: email.split("@")[0],
    // });

    // await sendEmailVerification(auth.currentUser);

    return user;
  };

  const signInWithGoogle = async () => {
    // const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    return signOut(auth);
  };
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  const updatePassword = (password) => {
    return currentUser.updatePassword(password);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentuser) => {
      // console.log(currentuser.email);
      setCurrentUser(currentuser);
      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const values = {
    currentUser,
    signUp,
    logIn,
    logOut,
    resetPassword,
    updatePassword,
    signInWithGoogle,
    uploadingFiles,
    setUploadingFiles,
    allFiles,
    setAllFiles,
  };

  return (
    <AuthContext.Provider value={values}>
      {/* childrens will only get values when loading is false */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
