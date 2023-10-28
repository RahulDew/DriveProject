import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "../Logo";
import { FiMoon, FiSun } from "react-icons/fi";

const Auth = () => {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className={`w-full min-h-screen text-center px-5 md:px-10 flex justify-center  lg:px-16 py-6 bg-blue-200 dark:bg-gray-950 duration-300`}
      >
        <div className="fixed special_gradient"></div>
        <div className="z-40 w-full text-black dark:text-slate-100">
          <div className="flex justify-between items-center">
            <Link to={"/"} className="flex items-center justify-center gap-3">
              <Logo />
              <h2 className="text-3xl font-bold">Stasher</h2>
            </Link>
            <div
              onClick={() => setDarkMode((prev) => !prev)}
              className="shadow-lg dark:shadow-none cursor-pointer p-2 bg-blue-600 text-white w-10 h-10 flex justify-center items-center rounded-full text-2xl"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </div>
          </div>

          {/* rendering the child components */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Auth;
