import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import AuthNav from "../components/Auth/AuthNav";
const Auth = () => {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className={`w-full min-h-screen text-center px-5 md:px-10 flex justify-center  lg:px-16 py-6 bg-[#E2EFFF] dark:bg-gray-950 duration-300`}
      >
        <div className="fixed special_gradient"></div>
        <div className="z-40 w-full text-black dark:text-slate-100">
          <AuthNav darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* rendering the child components */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Auth;
