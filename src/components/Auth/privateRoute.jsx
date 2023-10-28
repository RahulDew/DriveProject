import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";
import VerifyEmail from "../../Pages/VerifyEmail";
import UpdateProfile from "../UpdateProfile";

const PrivateRoutes = () => {
  const Location = useLocation();
  const { currentUser } = useAuthContext();

  return currentUser ? (
    currentUser.emailVerified && currentUser.displayName ? (
      <Outlet />
    ) : (
      <VerifyEmail />
    )
  ) : (
    // <Outlet />
    <Navigate to={"auth/start"} state={{ from: Location }} replace />
  );
};

export default PrivateRoutes;

// // backupcode
// return currentUser ? (
//   currentUser.emailVerified && currentUser.displayName ? (
//     <Outlet />
//   ) : currentUser.displayName && !currentUser.emailVerified ? (
//     <VerifyEmail />
//   ) : (
//     <UpdateProfile />
//   )
//   // <Outlet />
// ) : (
//   <Navigate to={"/start"} state={{ from: Location }} replace />
// );
