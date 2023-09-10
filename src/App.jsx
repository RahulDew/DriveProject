import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashBoard from "./Pages/DashBoard";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import ForgetPass from "./components/Auth/ForgetPass";
import Recents from "./Pages/Recents";
import Start from "./Pages/Start";
import PrivateRoutes from "./components/Auth/privateRoute";
// import UpdatePass from "./components/Auth/UpdatePass";

// import { auth } from "./config/firebase";
// import { useAuthState } from "react-firebase-hooks/auth";
import { useAuthContext } from "./context/AuthContext";
import Search from "./Pages/Search";
import Profile from "./Pages/Profile";
import UpdateProfile from "./components/UpdateProfile";
import VerifyEmail from "./Pages/VerifyEmail";

function App() {
  const { currentUser } = useAuthContext();
  // console.log(currentUser);

  // console.log("from App: ", currentUser);
  return (
    <>
      <Router>
        <Routes>
          {/* Private or Protected Routes */}
          <Route element={<PrivateRoutes />}>
            <Route exact path="/" element={<DashBoard />} />
            <Route exact path="/folder/:folderId" element={<DashBoard />} />
            <Route path="/recents" element={<Recents />} />
            <Route exact path="/search" element={<Search />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/updateProfile" element={<UpdateProfile />} />
            <Route exact path="/verifyEmail" element={<VerifyEmail />} />
          </Route>
          {/* Unprotected or Public Routes */}
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
