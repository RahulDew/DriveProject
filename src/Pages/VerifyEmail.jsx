import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { sendEmailVerification } from "firebase/auth";

import Logo from "../components/Logo";
import { FiMoon } from "react-icons/fi";

const VerifyEmail = () => {
  const { currentUser } = useAuthContext();

  const handleVerifyEmail = async () => {
    try {
      await sendEmailVerification(currentUser);
      alert("Email varification link is send to you inbox");
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="text-center min-h-screen flex flex-col  px-16 py-6 bg-[#E2EFFF]">
      <div className="w-full flex justify-between items-center">
        <Link to={"/"} className="flex items-center justify-center gap-3">
          <Logo />
          <h2 className="text-3xl text-black font-bold">Stasher</h2>
        </Link>
        <div className="shadow-lg cursor-pointer p-2 bg-blue-600 text-white w-10 h-10 flex justify-center items-center rounded-full text-2xl">
          <FiMoon />
        </div>
      </div>
      <div className="special_gradient"></div>

      <div className="z-40 ">
        <div className="w-full flex justify-center items-center ">
          <div
            className={`sm:mx-auto sm:w-full mt-14 max-w-2xl flex flex-col justify-center items-center gap-7`}
          >
            <p className="text-center text-3xl tracking-tight text-slate-700 font-semibold">
              Hey, {currentUser.email}
            </p>

            {/* Checking account is varified or not */}
            {currentUser.emailVerified ? (
              <>
                <h2 className="text-center w-92 text-6xl font-bold text-gray-900">
                  Your Account is Varified
                </h2>
                <p className="text-xl tracking-tight text-slate-700 ">
                  You Are Ready to, Enjoy Our services manage your files, with
                  cloud security, Ensuring we respect your privacy and don't
                  share your data with anyone...
                </p>
                <Link
                  to={"/"}
                  className="shadow-lg text-center text-lg m-auto w-48 justify-center gap-2 rounded-full p-5 outline-none border-none font-semibold bg-slate-900 text-white focus:bg-blue-700 hover:bg-blue-700 duration-300"
                >
                  Home
                </Link>
                <p className="text-center text-xl text-slate-700 font-extralight ">
                  Where memories find their sanctuary, and files journey beyond
                  limits. Embrace boundless horizons with our online storage
                  drive – your digital haven in the cloud.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-center w-92 text-6xl font-bold text-gray-900">
                  Verify Your Account
                </h2>
                <p className="text-xl tracking-tight text-slate-700 ">
                  By clicking
                  <span className="text-blue-600 mx-2">Verify Your Email</span>
                  button, We'll send you a varification email from
                  <span className="text-blue-600 mx-2">
                    {`noreply_at_stassher.firebaseapp.com_${currentUser.email}`}
                  </span>
                  . You need to verify your account email from your inbox to
                  ensure complete creation of your account
                </p>

                <button
                  type="submit"
                  onClick={handleVerifyEmail}
                  className="shadow-lg text-center text-lg m-auto w-48 justify-center gap-2 rounded-full p-5 outline-none border-none font-semibold bg-blue-600 text-white focus:bg-blue-700 hover:bg-blue-700 duration-300"
                >
                  Verify Your Email
                </button>

                <p className="text-center text-xl text-slate-700 font-extralight ">
                  This Varification step is Essential for Policy and using our
                  Service without Verification We aren't able to provide you any
                  Service at all
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
