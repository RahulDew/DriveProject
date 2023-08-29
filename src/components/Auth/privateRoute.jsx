import React, { Component } from "react";
import { Route, useNavigate } from "react-router-dom";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { auth } from "../../config/firebase";

// import { useAuthContext } from "../../context/AuthContext";
import { useAuthContext } from "../../context/AuthContext";
// import { AuthContext } from "../../context/AuthContext";

const PrivateRoutes = () => {
  const Location = useLocation();
  const { currentUser } = useAuthContext();
  // console.log("from private Route: ", currentUser);

  // console.log("ye component chal rha h ");
  // const currentUser = true;
  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to={"/start"} state={{ from: Location }} replace />
  );
};

export default PrivateRoutes;
