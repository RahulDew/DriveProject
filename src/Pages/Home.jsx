import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context/AuthContext";
import { AiOutlineArrowUp } from "react-icons/ai";
import Toast from "../widgits/Toast";
import { motion } from "framer-motion";
import { useThemeContext } from "../context/ThemeContext";

const Home = () => {
  const [toggleVisible, setToggleVisible] = useState(false);
  const [isOnline, setOnline] = useState(true);


  const { theme } = useThemeContext();
  const { toasts, removeToast } = useAuthContext();


  const handleToggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setToggleVisible(true);
    } else if (scrolled <= 300) {
      setToggleVisible(false);
    }
  };

  // event listener called when scroll
  window.addEventListener("scroll", handleToggleVisible);

  // event listeners to update online state
  window.addEventListener("online", () => {
    setOnline(true);
  });
  window.addEventListener("offline", () => {
    setOnline(false);
  });

  return (
    <div
      className={`w-full min-h-screen m-auto flex justify-center items-center ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      {/* Toast notification */}
      {toasts.length >= 1 && (
        <div className="m-auto fixed top-6 flex justify-center items-center flex-col gap-2 text-center">
          {toasts?.map((toast, index) => (
            <Toast key={index} toast={toast} removeToast={removeToast} />
          ))}
        </div>
      )}

      <div className="w-full min-h-screen sm:ml-16 lg:ml-20 text-center bg-[#E2EFFF] dark:bg-slate-950 duration-200 dark:text-white p-4 pb-28 sm:p-6 lg:px-8 lg:pt-4 lg:pb-28">
        <Navbar />

        {/* rendereing outlet */}
        <Outlet />

        {/* scroll to top */}
        {toggleVisible && (
          <motion.div
            layout
            initial={{ scale: 0, opacity: 0.2 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed right-10 bottom-24 sm:right-10 sm:bottom-10 rounded-full bg-gray shadow-xl"
          >
            <div
              onClick={() =>
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
              }
              className={`bg-blue-600 hover:bg-blue-700 text-slate-50 text-center p-3 text-xl lg:text-2xl rounded-2xl shadow-md cursor-pointer duration-200`}
            >
              <AiOutlineArrowUp />
            </div>
          </motion.div>
        )}
      </div>

      {!isOnline && (
        <div className="fixed inset-0 z-40 overflow-y-auto no-scrollbar">
          <div className="fixed inset-0 bg-gray-800 opacity-70 dark:bg-slate-950 dark:opacity-80 transition-opacity"></div>
          <div className="flex min-h-full justify-center items-start mt-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-72 md:w-96 text-lg relative overflow-hidden rounded-2xl font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-left shadow-xl"
            >
              {/* main content */}
              <div className="p-4 flex justify-center items-center flex-col gap-3">
                <h2 className="text-red-500">No Internet !</h2>
                <p className="text-base text-center font-normal">
                  Please check your internet connection
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
