import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleSignin = ({ handleGoogleSignIn }) => {
  return (
    // {/* Google Login Button */}
    <button
      type="submit"
      onClick={handleGoogleSignIn}
      className="shadow-lg flex w-full justify-center items-center gap-3 rounded-lg p-3 outline-none border-none text-base font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 dark:text-slate-200 dark:bg-slate-950 dark:hover:text-blue-600 duration-300 "
    >
      <FcGoogle className="text-2xl " />
      Signin with google
    </button>
  );
};

export default GoogleSignin;
