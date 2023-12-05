import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import { FiUploadCloud, FiMoon, FiSun } from "react-icons/fi";

import SideNav from "./SideNav";
import UploadingFileCard from "../widgits/UploadingFileCard";
// import DropdownOptions from
import DropdownOption from "../widgits/DropdownOption";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
const Navbar = () => {
  const [showUploadings, setShowUploadings] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [logoutWarning, setLogoutWarning] = useState(null);

  const Navigate = useNavigate();
  const location = useLocation();

  const {
    logOut,
    uploadingFiles,
    currentUser,
    handleToggleDarkMode,
    darkMode,
  } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logOut();
      // console.log("LoggedOut");
      Navigate("auth/login", { replace: true });
    } catch (error) {
      // console.log("Can't get logged out");
    }
  };

  const handleLogoutWarning = () => {
    setLogoutWarning({
      type: "logout",
    });
  };

  return (
    <nav className="flex items-center justify-between pt-1" aria-label="Global">
      <SideNav
        handleLogout={handleLogout}
        currentUser={currentUser}
        logoutWarning={logoutWarning}
        setLogoutWarning={setLogoutWarning}
        handleLogoutWarning={handleLogoutWarning}
      />
      {/* logo */}
      <Link to={"/"} className="flex gap-0 sm:gap-3">
        <div className="visible sm:hidden">
          <svg
            width="42"
            height="42"
            viewBox="0 0 82 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="trangles">
              <g id="darkgroup">
                <path
                  id="dark2"
                  d="M59.4902 52.7674C60.1569 53.1523 60.1569 54.1145 59.4902 54.4994L21.9974 76.1459C21.3307 76.5308 20.4974 76.0497 20.4974 75.2799L20.4974 31.9869C20.4974 31.2171 21.3307 30.736 21.9974 31.1209L59.4902 52.7674Z"
                  fill="url(#paint0_linear_114_6)"
                  fillOpacity="0.61"
                />
                <path
                  id="dark1"
                  d="M22.4485 29.986C21.781 29.6026 21.7787 28.6404 22.4444 28.2539L59.8856 6.51823C60.5514 6.13174 61.3858 6.61088 61.3877 7.38068L61.4907 50.6735C61.4926 51.4433 60.6604 51.9265 59.9928 51.5431L22.4485 29.986Z"
                  fill="url(#paint1_linear_114_6)"
                  fillOpacity="0.56"
                />
              </g>
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_114_6"
                x1="60.9902"
                y1="53.6334"
                x2="16.154"
                y2="38.6154"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.456376" stopColor="#0066FF" />
                <stop offset="1" stopColor="#161BA1" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_114_6"
                x1="20.9465"
                y1="29.1235"
                x2="61.488"
                y2="50.3847"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.497754"
                  stopColor="#F81111"
                  stopOpacity="0.98"
                />
                <stop offset="1" stopColor="#00058A" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="font-bold text-3xl">Stasher</span>
      </Link>

      {/* desktop navigation */}
      <div className="hidden sm:flex items-center justify-between gap-5">
        {/* dark mode toggler */}
        <div
          onClick={handleToggleDarkMode}
          className="hidden cursor-pointer h-11 w-11 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-50 hover:text-blue-600 hover:bg-white dark:hover:text-blue-600 dark:hover:bg-slate-800  sm:flex justify-center items-center rounded-2xl text-xl sm:text-2xl shadow-md duration-200"
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
              transition={{ duration: 0.3 }}
              className="bg-blue-600 curso w-6 h-6 rounded-full text-white text-base font-semibold"
            >
              {uploadingFiles.length}
            </motion.p>
          ) : (
            <></>
          )}
        </div>

        {/* profile image with profile route */}
        <Link to={"/profile"} className="hidden sm:block">
          <div
            className={`m-auto h-11 w-11 flex items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-800 border-2 hover:border-blue-600 ${
              location.pathname.toLowerCase().includes("profile")
                ? "border-blue-600"
                : "border-transparent"
            }  rounded-2xl shadow-md duration-200`}
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="object-cover h-full w-full rounded-[15px]"
              />
            ) : (
              <span className="text-xl font-bold text-white pb-1">
                {currentUser.displayName
                  ? currentUser.displayName[0].toUpperCase()
                  : currentUser.email[0].toUpperCase()}
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
              // layout
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
          className={`m-auto w-10 h-10 flex items-center justify-center cursor-pointer bg-slate-800 rounded-xl shadow-md ${
            location.pathname.toLowerCase().includes("profile")
              ? "border-2 border-blue-600"
              : "border-none"
          }`}
        >
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="object-cover h-full w-full rounded-xl"
            />
          ) : (
            <span className="text-xl font-bold text-white pb-0.5">
              {currentUser?.displayName
                ? currentUser.displayName[0].toUpperCase()
                : currentUser.email[0].toUpperCase()}
            </span>
          )}
        </div>
        {toggleDropdown && (
          <DropdownOption
            setToggleDropdown={setToggleDropdown}
            handleToggleDarkMode={handleToggleDarkMode}
            darkMode={darkMode}
            handleLogoutWarning={handleLogoutWarning}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* <!-- drawer component --> */}
      {showUploadings && (
        <div className="fixed inset-0 z-20 overflow-y-auto no-scrollbar">
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
            } backdrop-blur-lg bg-[#c4d5e7] dark:bg-slate-900 bg-opacity-70 dark:bg-opacity-40 text-slate-950 dark:text-slate-50 `}
          >
            <h5 className="text-lg font-bold uppercase">Uploading Files</h5>

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
