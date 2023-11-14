import React from "react";
import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import VerifyEmail from "../../Pages/VerifyEmail";

const PrivateRoutes = () => {
  const Location = useLocation();
  const { currentUser } = useAuthContext();

  return currentUser ? (
    currentUser.emailVerified ? (
      <Outlet />
    ) : (
      // rendering the email verification page
      <div className="w-full min-h-screen text-center px-5 md:px-10 flex justify-center  lg:px-16 py-6 bg-[#E2EFFF] dark:bg-gray-950 duration-300">
        <div className="fixed special_gradient"></div>
        <div className="z-40 w-full text-black">
          <div className="flex justify-between items-center">
            <Link to={"/"} className="flex items-center justify-center gap-3">
              <svg
                width="42"
                height="42"
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
              <h2 className="text-3xl font-bold">Stasher</h2>
            </Link>
          </div>

          <VerifyEmail />
        </div>
      </div>
    )
  ) : (
    <Navigate to={"auth/start"} state={{ from: Location }} replace />
  );
};

export default PrivateRoutes;
