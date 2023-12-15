import React from "react";
import { motion } from "framer-motion";

import { FiSun, FiMoon } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import PopupWrapper from "../components/PopupWrapper";

const DropdownOption = ({
  setToggleDropdown,
  themeToggle,
  theme,
  handleLogoutWarning,
  currentUser,
}) => {
  const handleCloseDropdownOption = () => {
    setToggleDropdown(false);
  };

  return (
    <PopupWrapper handleWrapperClose={handleCloseDropdownOption}>
      <motion.div
        layout
        initial={{ y: "-2vh" }}
        animate={{ y: 0 }}
        className="z-10 top-0 absolute w-full p-5 rounded-b-2xl shadow-lg bg-[#c4d5e7] dark:bg-slate-900 bg-opacity-70 backdrop-blur-lg dark:bg-opacity-40 flex flex-col gap-5 justify-end items-end"
      >
        <p className="text-center m-auto font-bold text-xl break-all">
          Hey,
          <span className="ml-1">
            {currentUser?.displayName
              ? currentUser.displayName
              : currentUser?.email.split("@")[0]}
          </span>
        </p>
        {/* logout button */}
        <button
          type="button"
          className="font-bold flex items-center text-lg gap-3 justify-center bg-red-500 text-slate-50  p-3 rounded-2xl w-full"
          onClick={() => {
            setToggleDropdown(false);
            handleLogoutWarning();
          }}
        >
          <BiLogOut className="text-2xl" />
          <span>Logout</span>
        </button>
        {/* darkmode toggler */}
        <button
          className="bg-slate-50 dark:bg-slate-700 w-full text-lg text-slate-950 dark:text-slate-50 p-3 font-semibold rounded-2xl"
          onClick={() => {
            setToggleDropdown(false);
            themeToggle();
          }}
        >
          {theme === "dark" ? (
            <div className=" flex items-center justify-center gap-3">
              <FiSun className="text-2xl" />
              <span>Lightmode</span>
            </div>
          ) : (
            <div className=" flex items-center justify-center gap-3">
              <FiMoon className="text-2xl" />
              <span>Darkmode</span>
            </div>
          )}
        </button>
      </motion.div>
    </PopupWrapper>
  );
};

export default DropdownOption;
