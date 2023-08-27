import { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashBoard from "./Pages/DashBoard";
import Signup from "./components/Auth/signup";
import Login from "./components/Auth/login";
import ForgetPass from "./components/Auth/ForgetPass";
import Recents from "./Pages/Recents";
import Start from "./Pages/Start";
// import UpdatePass from "./components/Auth/UpdatePass";

import { auth } from "./config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// import { useAuthContext } from "./context/AuthContext";

function App() {
  // const { currentUser } = useAuthContext();
  const [loading, setLoading] = useState();

  const [user] = useAuthState(auth);
  const Authenticate = () => {
    setLoading(true);
    setLoading(false);
  };
  // console.log(data);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={user ? <DashBoard /> : <Login />} />
          <Route
            path="/folder/:folderId"
            element={user ? <DashBoard /> : <Login />}
          />
          <Route path="recents" element={user ? <Recents /> : <Login />} />
          <Route exact path="/start" element={<Start />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/forgot-password" element={<ForgetPass />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
