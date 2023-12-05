import React, { useState } from "react";

import { Link, NavLink, useParams } from "react-router-dom";
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

const SideNav = ({
  handleLogout,
  currentUser,
  logoutWarning,
  setLogoutWarning,
  handleLogoutWarning,
}) => {
  // const { currentUser } = useAuthContext();
  const params = useParams();

  return (
    <>
      <aside className="fixed bottom-0 sm:top-0 left-0 z-10 w-full sm:w-16 lg:w-20 sm:h-screen">
        <div className="h-full px-1 py-5 overflow-y-auto bg-[#c4d5e7] dark:bg-slate-900 flex sm:flex-col justify-between items-center rounded-t-3xl bg-opacity-70 backdrop-blur-lg dark:bg-opacity-60 sm:dark:bg-opacity-100 sm:bg-opacity-100 sm:backdrop-blur-none sm:rounded-none duration-200">
          <div className="w-full flex sm:flex-col justify-center items-center gap-8">
            <Link to={"/"} className="hidden sm:block">
              <svg
                width="50"
                height="50"
                viewBox="0 0 90 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="trangles" clipPath="url(#clip0_108_2)">
                  <g id="darkgroup">
                    <path
                      id="dark2"
                      d="M66.4297 58.3602C67.0964 58.7451 67.0964 59.7074 66.4297 60.0923L22.9822 85.1767C22.3155 85.5616 21.4822 85.0805 21.4822 84.3107L21.4822 34.1418C21.4822 33.372 22.3155 32.8909 22.9822 33.2758L66.4297 58.3602Z"
                      fill="url(#paint0_linear_108_2)"
                      fillOpacity="0.61"
                    />
                    <path
                      id="dark1"
                      d="M23.4987 31.9747C22.8311 31.5914 22.8288 30.6291 23.4945 30.2426L66.8822 5.05485C67.548 4.66836 68.3824 5.1475 68.3843 5.9173L68.5037 56.086C68.5055 56.8558 67.6733 57.3389 67.0058 56.9556L23.4987 31.9747Z"
                      fill="url(#paint1_linear_108_2)"
                      fillOpacity="0.56"
                    />
                  </g>
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_108_2"
                    x1="67.9297"
                    y1="59.2262"
                    x2="16.5"
                    y2="41.9998"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.456376" stopColor="#0066FF" />
                    <stop offset="1" stopColor="#161BA1" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_108_2"
                    x1="21.9966"
                    y1="31.1122"
                    x2="68.5"
                    y2="55.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.497754"
                      stopColor="#F81111"
                      stopOpacity="0.98"
                    />
                    <stop offset="1" stopColor="#00058A" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="clip0_108_2">
                    <rect width="90" height="90" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <ul className=" w-full flex gap-3 sm:flex-col justify-evenly sm:justify-center items-center">
              {links.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.url}
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "bg-slate-100 text-center p-2.5 text-2xl text-blue-600 rounded-2xl duration-200 shadow-md"
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

      {logoutWarning && (
        <div className="fixed inset-0 z-40 overflow-y-auto no-scrollbar">
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
