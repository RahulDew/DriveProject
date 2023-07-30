import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(auth?.currentUser?.email);
  console.log(auth?.currentUser?.photoURL);
  // useEffect(() => {
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hey");
    // we're using async - await cause of this function takes time to setting data to the database
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-wrapper">
      <h1 style={{ textAlign: "center" }}>Sign Up or Sign In</h1>

      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="enter email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="enter password" onChange={(e) => setPassword(e.target.value)} />
        <button>Sign In</button>
      </form>

      <div className="next-login-wrapper">
        <button
          onClick={googleSignIn}
          style={{
            padding: "0.5rem",
            paddingRight: "1rem",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            backgroundColor: "aliceblue",
            color: "black",
            cursor: "pointer"
          }}
        >
          {" "}
          <img
            style={{
              width: "41px",
              height: "38px",
              backgroundColor: "aliceblue",
            }}
            src="https://www.pngplay.com/wp-content/uploads/13/Google-Logo-PNG-HD-Quality.png"
          />{" "}
          Sign In with Google
        </button>
        <button
          onClick={logOut}
          style={{
            padding: "0.8rem",
            borderRadius: "10px",
            backgroundColor: "rgb(320, 76, 76)",
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Auth;
