import React, { Children, createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { auth, googleProvider } from "../config/firebase";
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
  const [loading, setLoading] = useState(true);

  const signUp = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
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
      // if (currentuser) {
        setLoading(false);
      // }
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
  };

  return (
    <AuthContext.Provider value={values}>
      {/* childrens will only get values when loading is false */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
