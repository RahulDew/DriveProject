import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className={`w-full text-center px-5 md:px-10 flex justify-center bg-[#E2EFFF] dark:bg-gray-950 duration-300`}
      >
        <div className="fixed special_gradient"></div>
        <div className="z-40 w-full text-black dark:text-slate-100">
          <section className="min-h-screen flex justify-center items-center">
            <div className="text-center py-8 px-4 mx-auto lg:py-16 lg:px-6">
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold md:text-8xl lg:text-9xl text-primary-600 dark:text-primary-500">
                404
              </h1>
              <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                Page Not Found.
              </p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                Sorry, we can't find that page. You'll find lots to explore on
                the home page.
              </p>
              <Link
                to={"/"}
                className="inline-flex shadow-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-full text-base sm:text-lg px-5 py-4 text-center my-2 duration-200"
              >
                Back to home
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
