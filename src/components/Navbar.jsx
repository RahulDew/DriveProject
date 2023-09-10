import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { FiUploadCloud, FiMoon } from "react-icons/fi";

import SideNav from "./SideNav";
import UploadingFileCard from "../widgits/UploadingFileCard";
import { motion } from "framer-motion";

const Navbar = () => {
  const [showUploadings, setShowUploadings] = useState(false);

  const Navigate = useNavigate();

  const { logOut, uploadingFiles, currentUser } = useAuthContext();
  // console.log(currentUser);

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("LoggedOut");
      Navigate("login", { replace: true });
    } catch (error) {
      console.log("Can't get logged out");
    }
  };

  return (
    <nav className="flex items-center justify-between" aria-label="Global">
      <SideNav handleLogout={handleLogout} />
      <div className="flex lg:flex-1">
        <Link to={"/"} className="flex gap-3 -m-1.5 p-1.5">
          <span className="font-bold text-3xl">Stasher</span>
        </Link>
      </div>
      <div></div>
      <div className="flex items-center justify-between gap-5">
        <div className="cursor-pointer p-2.5 bg-white text-slate-600 hover:bg-blue-600 hover:text-white flex justify-center items-center rounded-xl text-2xl shadow-md duration-300">
          <FiMoon />
        </div>
        <div
          className="flex gap-2 items-center cursor-pointer text-2xl bg-slate-50 p-2.5 rounded-xl shadow-md"
          onClick={() => setShowUploadings(true)}
        >
          <FiUploadCloud className="text-slate-600" />
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
        <div className="m-auto h-11 w-11 flex items-center justify-center cursor-pointer bg-orange-500 rounded-xl shadow-md">
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
      </div>

      {/* <!-- drawer component --> */}
      {showUploadings && (
        <div className="fixed inset-0 z-20 overflow-y-auto ">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="fixed inset-0 bg-gray-800 opacity-70 transition-opacity"
            onClick={() => setShowUploadings(false)}
          ></motion.div>
          <motion.div
            initial={{ x: "2vw" }}
            animate={{ x: 0 }}
            className={`fixed top-0 right-0 bottom-0 z-20 w-64 min-h-screen py-4 px-3 overflow-y-auto  ${
              !showUploadings && "transition-transform translate-x-full"
            } backdrop-blur-sm bg-[#E2EFFF] bg-opacity-75`}
          >
            <h5 className="text-lg font-bold text-black uppercase dark:text-gray-400">
              Uploading Files
            </h5>

            {Array.isArray(uploadingFiles) && uploadingFiles.length ? (
              <div className="z-20 my-5 flex justify-center text-center flex-col gap-3">
                {uploadingFiles.map((file, index) => (
                  <UploadingFileCard key={index} file={file} index={index} />
                ))}
              </div>
            ) : (
              <div className="mt-20">
                <h2 className="text-2xl font-semibold">Working Clean</h2>
                <p className="text-xl font-light">
                  Ready to Upload files
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
