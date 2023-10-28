import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { FiUploadCloud, FiMoon, FiSun } from "react-icons/fi";

import SideNav from "./SideNav";
import UploadingFileCard from "../widgits/UploadingFileCard";
import { motion } from "framer-motion";

const Navbar = () => {
  const [showUploadings, setShowUploadings] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [logoutWarning, setLogoutWarning] = useState(null);

  const Navigate = useNavigate();

  const {
    logOut,
    uploadingFiles,
    currentUser,
    handleToggleDarkMode,
    darkMode,
  } = useAuthContext();
  // console.log(currentUser);

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("LoggedOut");
      Navigate("auth/login", { replace: true });
    } catch (error) {
      console.log("Can't get logged out");
    }
  };

  const handleLogoutWarning = () => {
    setLogoutWarning({
      type: "logout",
    });
  };

  return (
    <nav className="flex items-center justify-between " aria-label="Global">
      <SideNav
        handleLogout={handleLogout}
        currentUser={currentUser}
        logoutWarning={logoutWarning}
        setLogoutWarning={setLogoutWarning}
        handleLogoutWarning={handleLogoutWarning}
      />
      <div className="flex">
        <Link to={"/"} className="flex gap-3 p-1.5 pb-3">
          <span className="font-bold text-3xl">Stasher</span>
        </Link>
      </div>

      {/* desktop navigation */}
      <div className="hidden sm:flex items-center justify-between gap-5">
        {/* dark mode toggler */}
        <div
          onClick={handleToggleDarkMode}
          className="hidden cursor-pointer h-11 w-11 lg:h-12 lg:w-12 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-50 hover:text-blue-600 hover:bg-white dark:hover:text-blue-600 dark:hover:bg-slate-800  sm:flex justify-center items-center rounded-2xl text-xl sm:text-2xl shadow-md duration-200"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </div>
        {/* uploading files button */}
        <div
          className="flex gap-2 items-center cursor-pointer text-xl sm:text-2xl bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-50 hover:text-blue-600 hover:bg-white dark:hover:text-blue-600 dark:hover:bg-slate-800  p-2.5 rounded-2xl shadow-md duration-200"
          onClick={() => setShowUploadings(true)}
        >
          <FiUploadCloud />
          {uploadingFiles.length ? (
            <motion.p
              layout
              // animate={{}}
              transition={{ duration: 0.3 }}
              className="bg-blue-600 curso w-6 h-6 rounded-full text-white text-base font-semibold"
            >
              {uploadingFiles.length}
            </motion.p>
          ) : (
            <></>
          )}
        </div>
        {/* profile route */}
        <Link to={"/profile"} className="hidden sm:block">
          <div className="m-auto h-11 w-11 flex items-center justify-center cursor-pointer bg-orange-500 rounded-2xl shadow-md">
            {currentUser && currentUser ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="object-cover h-full w-full rounded-xl"
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {currentUser.displayName[0].toUpperCase()}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* mobile navigation */}
      <div className="flex sm:hidden relative gap-3">
        {/* uploading files button */}
        <div
          className="flex gap-2 items-center cursor-pointer text-xl bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800 p-2.5 rounded-xl shadow-md duration-200"
          onClick={() => setShowUploadings(true)}
        >
          <FiUploadCloud />
          {uploadingFiles.length ? (
            <motion.p
              layout
              // animate={{}}
              // transition={{ duration: 0.3 }}
              className="text-slate-900 dark:text-blue-600 pb-0.5 text-sm font-semibold duration-200"
            >
              {uploadingFiles.length} 
            </motion.p>
          ) : (
            <></>
          )}
        </div>
        {/* currentuser profile image */}
        <div
          onClick={() => setToggleDropdown((prev) => !prev)}
          className="m-auto w-10 h-10 flex items-center justify-center cursor-pointer bg-orange-500 rounded-xl shadow-md"
        >
          {currentUser && currentUser ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="object-cover h-full w-full rounded-xl"
            />
          ) : (
            <span className="text-xl font-bold text-white">
              {currentUser.displayName[0].toUpperCase()}
            </span>
          )}
        </div>
        {toggleDropdown && (
          <motion.div
            layout
            initial={{ y: "-2vh" }}
            animate={{ y: 0 }}
            className="absolute right-0 top-full mt-3 w-full p-3 rounded-xl shadow-lg bg-slate-50 dark:bg-slate-800 min-w-[11rem] flex flex-col gap-2 justify-end items-end"
          >
            {/* darkmode toggler */}
            <button
              className="bg-slate-300 dark:bg-slate-700  w-full text-base text-slate-950 dark:text-slate-50 p-3 font-semibold rounded-full"
              onClick={() => {
                setToggleDropdown(false);
                handleToggleDarkMode();
              }}
            >
              {darkMode ? (
                <div className=" flex items-center justify-center gap-1">
                  <FiSun className="text-xl" />
                  <span>Lightmode</span>
                </div>
              ) : (
                <div className=" flex items-center justify-center gap-1">
                  <FiMoon className="text-xl" />
                  <span>Darkmode</span>
                </div>
              )}
            </button>
            {/* <Link
                className="bg-slate-200 dark:bg-slate-700 p-2 px-4 font-semibold rounded-full flex items-center justify-center gap-2"
                onClick={() => {
                  setShowUploadings(true);
                  setToggleDropdown(false);
                }}
              >
                Uploadings <FiUploadCloud />
              </Link> */}
            {/* logout button */}
            <button
              type="button"
              className="mt-2 font-bold bg-red-500 text-slate-50 text-base p-3 rounded-full w-full"
              onClick={() => {
                setToggleDropdown(false);
                handleLogoutWarning();
              }}
            >
              Log Out
            </button>
          </motion.div>
        )}
      </div>

      {/* <!-- drawer component --> */}
      {showUploadings && (
        <div className="fixed inset-0 z-20 overflow-y-auto ">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="fixed inset-0 bg-slate-800 opacity-70 dark:bg-slate-950 dark:opacity-80 transition-opacity"
            onClick={() => setShowUploadings(false)}
          ></motion.div>
          <motion.div
            initial={{ x: "2vw" }}
            animate={{ x: 0 }}
            className={`fixed top-0 right-0 bottom-0 z-20 w-52 sm:w-64 min-h-screen py-4 px-3 overflow-y-auto  ${
              !showUploadings && "transition-transform translate-x-full"
            } backdrop-blur-sm bg-white dark:bg-slate-900 bg-opacity-70 dark:bg-opacity-60 text-slate-950 dark:text-slate-50 `}
          >
            <h5 className="text-lg font-bold  uppercase ">Uploading Files</h5>

            {Array.isArray(uploadingFiles) && uploadingFiles.length ? (
              <div className="z-20 my-5 flex justify-center text-center flex-col gap-3">
                {uploadingFiles.map((file, index) => (
                  <UploadingFileCard key={index} file={file} index={index} />
                ))}
              </div>
            ) : (
              <div className="mt-20">
                <h2 className="text-2xl font-semibold">Working Clean</h2>
                <p className="text-xl font-light">Ready to Upload files</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
