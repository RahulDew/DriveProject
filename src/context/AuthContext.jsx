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
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [contentLoading, setContentLoading] = useState(false);

  // for toast notification
  const [toasts, setToasts] = useState([]);
  const [autoCloseDuration, setAutoCloseDuration] = useState(5);
  // const [autoClose, setAutoClose] = useState(true);

  const signUp = async (email, password) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // await updateProfile(auth.currentUser, {
    //   displayName: email.split("@")[0],
    // });

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

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleShowToast = (message, type) => {
    const toast = {
      id: Date.now(),
      message,
      type,
    };
    // console.log(toast);

    if (toasts.length <= 2) {
      setToasts((prevToasts) => [...prevToasts, toast]);
    } else {
      setToasts([toast]);
    }

    setTimeout(() => {
      removeToast(toast.id);
      // setToasts([]);
    }, autoCloseDuration * 600);
  };

  const removeToast = (toastId) => {
    setToasts((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== toastId)
    );
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
    authLoading,
    setAuthLoading,
    authError,
    setAuthError,
    contentLoading,
    setContentLoading,
    darkMode,
    setDarkMode,
    handleToggleDarkMode,
    toasts,
    handleShowToast,
    removeToast,
  };

  return (
    <AuthContext.Provider value={values}>
      {/* childrens will only get values when loading is false */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
