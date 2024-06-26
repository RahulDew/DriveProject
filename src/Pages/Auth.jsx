import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import AuthNav from "../components/Auth/AuthNav";
import { useThemeContext } from "../context/ThemeContext";
const Auth = () => {
  const { theme, themeToggle } = useThemeContext();
  return (
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      <div
        className={`w-full min-h-screen text-center px-5 md:px-10 flex justify-center  lg:px-16 py-6 bg-[#E2EFFF] dark:bg-gray-950 duration-300`}
      >
        <div className="fixed special_gradient"></div>
        <div className="z-40 w-full text-black dark:text-slate-100">
          <AuthNav
            theme={theme}
            themeToggle={themeToggle}
          />

          {/* rendering the child components */}
          <Outlet />
          {/* <footer className="absolute bottom-0 m-auto text-center">Stasher © 2023</footer> */}
        </div>
      </div>
    </div>
  );
};

export default Auth;
