import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashBoard from "./Pages/DashBoard";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import ForgetPass from "./components/Auth/ForgetPass";
import Recents from "./Pages/Recents";
import Start from "./Pages/Start";

import PrivateRoutes from "./components/Auth/PrivateRoute";
import PublicRoute from "./components/Auth/PublicRoute";

import Search from "./Pages/Search";
import Profile from "./Pages/Profile";
import UpdateProfile from "./components/UpdateProfile";
import VerifyEmail from "./components/VerifyEmail";
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import { useAuthContext } from "./context/AuthContext";

function App() {
  // const { currentUser } = useAuthContext();
  // console.log(currentUser);
  return (
    <>
      <Router>
        <Routes>
          {/* Private or Protected Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />}>
              <Route path="" element={<DashBoard />} />
              <Route path="folder/:folderId" element={<DashBoard />} />
              <Route path="search" element={<Search />} />
              <Route path="profile" element={<Profile />} />
              <Route path="recents" element={<Recents />} />
              <Route exact path="updateProfile" element={<UpdateProfile />} />
              <Route exact path="verifyEmail" element={<VerifyEmail />} />
            </Route>
          </Route>

          {/* Unprotected or Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<Auth />}>
              <Route
                exact
                path="updateProfile"
                element={<UpdateProfile auth />}
              />
              <Route exact path="verifyEmail" element={<VerifyEmail />} />
              <Route path="start" element={<Start />} />
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgetPass />} />
            </Route>
          </Route>

          {/* For Undefined/False Routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
