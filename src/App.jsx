import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashBoard from "./Pages/DashBoard";
import Signup from "./components/Auth/signup";
import Login from "./components/Auth/login";
import ForgetPass from "./components/Auth/ForgetPass";
import Recents from "./Pages/Recents";
import Start from "./Pages/Start";
import PrivateRoutes from "./components/Auth/privateRoute";
// import UpdatePass from "./components/Auth/UpdatePass";

// import { auth } from "./config/firebase";
// import { useAuthState } from "react-firebase-hooks/auth";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { currentUser } = useAuthContext();

  // console.log("from App: ", currentUser);
  return (
    <>
      <Router>
        <Routes>
          {/* Private or Protected Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<DashBoard />} />
            <Route
              path="/folder/:folderId"
              element={currentUser ? <DashBoard /> : <Login />}
            />
            <Route
              path="recents"
              element={currentUser ? <Recents /> : <Login />}
            />
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
