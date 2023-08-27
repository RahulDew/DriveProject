import React from "react";
import { Link } from "react-router-dom";
import { FcNightLandscape } from "react-icons/fc";
import {
  FiGrid,
  FiShield,
  FiMoon,
  FiDownloadCloud,
  FiFolder,
  FiImage,
} from "react-icons/fi";

const Start = () => {
  return (
    <div className="w-full min-h-screen text-center items-center justify-center flex flex-col px-16 py-6 bg-[#E2EFFF]">
      <div className="special_gradient"></div>
      <div className="z-40">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-3xl text-black font-bold">Stasher</h2>
          <div className="nuromorphic_button p-2 bg-blue-600 text-white w-10 h-10 flex justify-center items-center rounded-full text-2xl">
            <FiMoon />
          </div>
        </div>
        <div className="font-bold  flex justify-center items-center gap-4 flex-col mt-20 text-7xl">
          <span className="bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent">
            Welcome, Dude
          </span>
          <h1> Save And Protect Your Files </h1>
          {/* <h1> Save And Protect Your Files </h1> */}
        </div>
        <div>
          <div className="flex items-center justify-center gap-12 m-10">
            <Link
              to={"/signup"}
              className="nuromorphic_button w-28 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 duration-300 text-center text-lg font-semibold"
            >
              Sign Up
            </Link>
            <div className="font-semibold text-xl">OR</div>

            <Link
              to={"/login"}
              className="nuromorphic_button w-28 py-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-950 duration-300 text-center text-lg font-semibold"
            >
              Log In
            </Link>
          </div>
          <p className="text-xl m-auto w-3/6">
            Where memories find their sanctuary, and files journey beyond
            limits. Embrace boundless horizons with our online storage drive –
            your digital haven in the cloud.
          </p>
          <ul className="my-16 text-center flex justify-between md:justify-center gap-28 flex-wrap text-7xl items-center">
            <li>
              <FiGrid />
            </li>
            <li>
              <FiFolder />
            </li>
            <li>
              <FiImage />
            </li>
            <li>
              <FiShield />
            </li>
            <li className="">
              <FiDownloadCloud />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Start;
