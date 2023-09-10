import React from "react";

import { NavLink } from "react-router-dom";

import Logo from "./logo";

import { BiLogOut } from "react-icons/bi";
import { IoIosTimer } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";

const links = [
  { url: `/`, text: "All", icon: <AiOutlineHome /> },
  { url: "/search", text: "Search", icon: <BiSearchAlt2 /> },
  { url: "/recents", text: "Recents", icon: <IoIosTimer /> },
];

const SideNav = ({ handleLogout }) => {
  return (
    <aside className=" bg-[#E2EFFF] fixed top-0 left-0 z-10 w-20 h-screen transition-transform -translate-x-full sm:translate-x-0">
      <div className="h-full px-3 py-4 overflow-y-auto bg-slate-400 bg-opacity-25 flex flex-col justify-between ">
        <div className="flex flex-col gap-8">
          <div className="">
            <Logo />
          </div>
          <ul className="flex gap-3 flex-col justify-center items-center">
            {links.map((link, index) => (
              <NavLink
                key={index}
                to={link.url}
                // children
                className={({ isActive, isPending }) =>
                  isPending
                    ? "bg-slate-100 text-center p-2.5 text-2xl text-blue-600 rounded-xl duration-300 shadow-md"
                    : isActive
                    ? "bg-blue-600 text-center p-2.5 text-2xl text-white rounded-xl duration-300 shadow-md"
                    : "bg-slate-50 text-slate-700 hover:text-blue-600 text-center p-2.5 text-2xl  rounded-xl duration-300 shadow-md"
                }
              >
                {link.icon}
              </NavLink>
            ))}
          </ul>
        </div>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex justify-center items-center p-2.5 py-3 text-2xl font-semibold leading-6 text-white bg-blue-600 hover:bg-blue-700 rounded-xl duration-300 shadow-md"
        >
          <BiLogOut />
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
