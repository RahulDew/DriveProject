import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { auth, googleProvider } from "../config/firebase";
import { updateProfile } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
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
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [contentLoading, setContentLoading] = useState(false);

  // for toast notification
  const [toasts, setToasts] = useState([]);

  const signUp = async (email, password) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(auth.currentUser, {
      displayName: email.split("@")[0],
    });
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

  const handleToggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const handleAuthError = (message) => {
    if (message) {
      setAuthError(message);
    } else {
      setAuthError(null);
    }

    setTimeout(() => {
      setAuthError(null);
    }, 5000);
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
    }, 1500);
  };

  const removeToast = (toastId) => {
    setToasts((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== toastId)
    );
  };

  // getting the user and verifing authorization
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
    signInWithGoogle,
    uploadingFiles,
    setUploadingFiles,
    authLoading,
    setAuthLoading,
    authError,
    handleAuthError,
    contentLoading,
    setContentLoading,
    darkMode,
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
