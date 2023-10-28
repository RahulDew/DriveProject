import React, { useState } from "react";

import { NavLink, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Logo from "./logo";

import { BiLogOut } from "react-icons/bi";
import { IoIosTimer } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";

const links = [
  { url: `/`, text: "All", icon: <AiOutlineHome /> },
  { url: "/search", text: "Search", icon: <BiSearchAlt2 /> },
  { url: "/recents", text: "Recents", icon: <IoIosTimer /> },
  { url: "/profile", text: "Profile", icon: <FaRegUser /> },
];

const SideNav = ({ handleLogout, currentUser, logoutWarning, setLogoutWarning, handleLogoutWarning }) => {
  // const { currentUser } = useAuthContext();
  const params = useParams();
  

  return (
    <>
      <aside className="fixed bottom-0 sm:top-0 left-0 z-10 w-full sm:w-16 lg:w-20 sm:h-screen">
        <div className="h-full px-1 py-4 overflow-y-auto bg-[#c4d5e7] dark:bg-slate-900 flex sm:flex-col justify-between items-center rounded-t-3xl bg-opacity-70 backdrop-blur-lg sm:bg-opacity-100 sm:backdrop-blur-none sm:rounded-none duration-200">
          <div className="w-full flex sm:flex-col justify-center items-center gap-8">
            <div className="hidden sm:block">
              <Logo />
            </div>
            <ul className=" w-full flex gap-3 sm:flex-col justify-evenly sm:justify-center items-center">
              {links.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.url}
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "bg-slate-100 text-center p-2.5 text-2xl text-blue-600 rounded-lg duration-200 shadow-md"
                      : (
                          link.text == "All"
                            ? isActive || params.folderId
                            : isActive
                        )
                      ? `${
                          link.text == "Profile" && "block sm:hidden "
                        } w-20 h-11 sm:w-11 lg:h-12 lg:w-12  bg-blue-600 text-center p-2.5 text-2xl text-white rounded-2xl duration-200 shadow-md flex justify-center items-center gap-2`
                      : `${
                          link.text == "Profile" && "block sm:hidden "
                        } w-20 h-11 sm:w-11 lg:h-12 lg:w-12 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-50 hover:text-blue-600 hover:bg-blue-100 dark:hover:text-blue-600 dark:hover:bg-blue-950 text-center p-2.5 text-2xl rounded-2xl duration-200 shadow-md flex justify-center items-center gap-2`
                  }
                >
                  {link.icon}
                </NavLink>
              ))}
            </ul>
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogoutWarning}
            className="hidden w-20 h-11 sm:w-11 lg:h-12 lg:w-12 sm:flex justify-center items-center p-2.5 py-3 text-2xl font-semibold leading-6 text-white bg-red-500 hover:bg-red-600 rounded-xl duration-200 shadow-md"
          >
            <BiLogOut />
          </button>
        </div>
      </aside>

      {/* {openAddItemModel && (
        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div
            onClick={() => setOpenAddItemMod(false)}
            className="fixed inset-0 bg-slate-800 opacity-70 dark:bg-slate-950 dark:opacity-80 transition-opacity"
          ></div>
          <div className="h-screen ">
            <motion.div
              layout
              initial={{ y: "3vh" }}
              animate={{ y: 0 }}
              className="relative w-full h-full flex gap-5 justify-center items-end pb-24"
            >
              <button
                className={
                  "bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-50 hover:text-blue-600 hover:bg-blue-100 text-center rounded-full duration-300 shadow-md"
                }
              >
                <AddFolderButton mobileNav={true} />
              </button>
              <button
                className={
                  "bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-50 hover:text-blue-600 hover:bg-blue-100 text-center rounded-full duration-300 shadow-md"
                }
              >
                <AddFileButton mobileNav={true} />
              </button>
            </motion.div>
          </div>
        </div>
      )} */}

      {logoutWarning && (
        <div className="fixed inset-0 z-40 overflow-y-auto ">
          <div
            onClick={() => setLogoutWarning(null)}
            className={
              "fixed inset-0 bg-gray-800 opacity-70 dark:bg-slate-950 dark:opacity-80 transition-opacity"
            }
          ></div>
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              {/* main content */}
              <div className="p-8 px-20 flex justify-center items-center flex-col gap-5">
                {logoutWarning.type == "logout" ? (
                  <>
                    {/* logout confirmation confirmation */}
                    <div className="flex flex-col gap-2 text-lg text-center text-slate-500 dark:text-slate-300">
                      <p className="text-2xl text-center font-semibold">
                        Logout:
                      </p>
                      <p className="text-center text-lg text-slate-500 dark:text-slate-300">
                        See you on next time, Dude
                      </p>
                      <span className="text-blue-600 font-semibold block">
                        {currentUser.email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-32 rounded-xl bg-red-500 hover:bg-red-600 duration-300 p-3 text-md font-semibold leading-6 text-white shadow-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-3xl">NULL</p>
                  </>
                )}
              </div>

              {/* confirmation */}
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideNav;
