import React from "react";
import { Link } from "react-router-dom";
import {
  FiGrid,
  FiShield,
  FiDownloadCloud,
  FiFolder,
  FiImage,
} from "react-icons/fi";

const featuresList = [
  {
    name: "Multiple Options",
    icon: <FiGrid />,
    desc: "Find everything attrective and cool in every part in this",
  },
  {
    name: "Custom Folders",
    icon: <FiFolder />,
    desc: "Organize your files and momories by creating your own folders ",
  },
  // {
  //   name: "View of Images",
  //   icon: <FiImage />,
  //   desc: "bunch of usable functionality",
  // },
  {
    name: "Always Protected",
    icon: <FiShield />,
    desc: "Protected every files to maintain your privacy and security",
  },
  {
    name: "Easy Download",
    icon: <FiDownloadCloud />,
    desc: "Available to download easily anytime and anywhere for you",
  },
];

const Start = () => {
  return (
    <>
      <div className="select-none w-full font-bold flex justify-center items-center gap-4 flex-col mt-10 text-5xl sm:text-6xl md:text-7xl">
        <span className="bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent">
          Welcome, Dude
        </span>
        <h1 className="dark:opacity-90"> Save And Protect Your Files </h1>
      </div>
      <div className="">
        <div className="flex items-center justify-center gap-8 sm:gap-12 my-10">
          <Link
            to={"/auth/signup"}
            className="shadow-lg w-24 md:w-28 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 duration-300 text-center text-[17px] md:text-lg font-semibold"
          >
            Sign Up
          </Link>

          <div className="font-semibold text-xl">OR</div>

          <Link
            to={"/auth/login"}
            className="shadow-lg w-24 md:w-28 py-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-950 dark:hover:text-black dark:hover:bg-slate-100 duration-300 text-center text-[17px] md:text-lg font-semibold"
          >
            Log In
          </Link>
        </div>
        <p className="dark:opacity-80 font-light text-xl sm:text-2xl m-auto w-full sm:w-5/6 lg:w-4/6">
          Where memories find their sanctuary, and files journey beyond limits.
          Embrace boundless horizons with our online storage drive – your
          digital haven in the cloud.
        </p>
        <ul className="mt-12 dark:opacity-75 text-center flex flex-wrap justify-center items-center md:justify-center gap-7 sm:gap-2 lg:gap-10 text-[3.3rem]  md:text-6xl lg:text-7xl">
          {featuresList.map((item, index) => (
            <li
              key={index}
              className="flex gap-2 flex-col items-center justify-center"
            >
              {item.icon}
              <span className="text-lg lg:text-lg font-semibold">
                {item.name}
              </span>
              <p className="w-44 lg:w-52 text-base font-light">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Start;
