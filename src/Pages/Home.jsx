import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context/AuthContext";
import { AiOutlineArrowUp } from "react-icons/ai";
import Toast from "../widgits/Toast";
import { motion } from "framer-motion";

const Home = () => {
  const { darkMode, toasts, removeToast } = useAuthContext();
  const [toggleVisible, setToggleVisible] = useState(false);

  const handleToggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setToggleVisible(true);
    } else if (scrolled <= 300) {
      setToggleVisible(false);
    }
  };

  window.addEventListener("scroll", handleToggleVisible);

  // console.log(toasts);

  return (
    <div
      className={`w-full min-h-screen m-auto flex justify-center items-center ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Toast notification */}
      {toasts.length >= 1 && (
        <div className="m-auto absolute top-6 flex justify-center items-center flex-col gap-2 text-center">
          {toasts?.map((toast, index) => (
            <Toast key={index} toast={toast} removeToast={removeToast} />
          ))}
        </div>
      )}

      <div className="w-full sm:ml-16 lg:ml-20 text-center bg-[#E2EFFF] dark:bg-slate-950 duration-200 dark:text-white min-h-screen p-4 pb-28 sm:p-6 lg:px-8 lg:pt-4">
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
    </div>
  );
};

export default Home;
