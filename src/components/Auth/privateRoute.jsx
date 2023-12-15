import React from "react";
import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import VerifyEmail from "../VerifyEmail";
import AuthNav from "./AuthNav";
import { useThemeContext } from "../../context/ThemeContext";

const PrivateRoutes = () => {
  const Location = useLocation();
  const { currentUser} = useAuthContext();
  const { theme, themeToggle } = useThemeContext();

  return currentUser ? (
    currentUser.emailVerified ? (
      <Outlet />
    ) : (
      // rendering the email verification page
      <div className="w-full min-h-screen text-center px-5 md:px-10 flex justify-center lg:px-16 py-6 bg-[#E2EFFF] dark:bg-gray-950 duration-300">
        <div className="fixed special_gradient"></div>
        <div className="z-40 w-full text-black">
          <AuthNav
            theme={theme}
            themeToggle={themeToggle}
          />
          <VerifyEmail />
          {/* <footer className="bottom-0 mt-10">Stasher © 2023</footer> */}
        </div>
      </div>
    )
  ) : (
    <Navigate to={"auth/start"} state={{ from: Location }} replace />
  );
};

export default PrivateRoutes;
