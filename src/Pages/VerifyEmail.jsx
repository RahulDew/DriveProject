import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { sendEmailVerification } from "firebase/auth";

const VerifyEmail = () => {
  const { currentUser } = useAuthContext();

  const handleVerifyEmail = async () => {
    try {
      await sendEmailVerification(currentUser);
      alert("Email varification link is send to your email inbox");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/too-many-requests") {
        // console.log("Too Many Verification Request try after sometime!");
        alert("Too Many verification request try after sometime!");
      } else {
        alert("verification request failed try after sometime!");
      }
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div
        className={` sm:mx-auto md:w-full mt-14 max-w-2xl flex flex-col justify-center items-center gap-7`}
      >
        <p className="text-center text-2xl sm:text-3xl tracking-tight text-slate-700 dark:text-slate-400 font-semibold break-all">
          Hey, {currentUser.email}
        </p>

        {/* Checking account is varified or not */}
        {currentUser.emailVerified ? (
          <>
            <h2 className="text-center w-full sm:w-92 text-5xl sm:text-6xl font-bold dark:text-slate-200">
              Your Account is Varified
            </h2>
            <p className="text-lg sm:text-xl tracking-tight text-slate-700 dark:text-slate-400 ">
              You Are Ready to, Enjoy Our services manage your files, with cloud
              security, Ensuring we respect your privacy and don't share your
              data with anyone...
            </p>
            <Link
              to={"/"}
              className="shadow-lg text-center text-base sm:text-lg m-auto w-40 sm:w-48 justify-center gap-2 rounded-full p-2 py-4 sm:p-5  outline-none border-none font-semibold bg-slate-900 text-white dark:bg-slate-200 dark:text-black focus:bg-blue-700 hover:bg-blue-700  dark:focus:bg-blue-700 dark:hover:bg-blue-700 dark:hover:text-slate-200 duration-200"
            >
              Home
            </Link>
            <p className="text-center text-lg sm:text-xl text-slate-700 dark:text-slate-400 font-extralight ">
              Where memories find their sanctuary, and files journey beyond
              limits. Embrace boundless horizons with our online storage drive –
              your digital haven in the cloud.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-center w-full sm:w-92 text-5xl sm:text-6xl font-bold dark:text-slate-200">
              Verify Your Account
            </h2>
            <p className="text-lg sm:text-xl tracking-tight text-slate-700 dark:text-slate-400">
              By clicking
              <span className="text-blue-600 mx-2">Verify Your Email</span>
              button, We'll send you a varification email from
              <span className="text-blue-600 mx-2 break-all">
                {`noreply_at_stassher.firebaseapp.com_${currentUser.email}`}
              </span>
              . You need to verify your account email from your inbox to ensure
              complete creation of your account and then hit refresh
            </p>

            <button
              type="submit"
              onClick={handleVerifyEmail}
              className="shadow-lg text-center text-base sm:text-lg m-auto w-40 sm:w-48 justify-center gap-2 rounded-full p-2 py-4 sm:p-5 outline-none border-none font-semibold bg-blue-600 text-white focus:bg-blue-700 hover:bg-blue-700 duration-300"
            >
              Verify Your Email
            </button>

            <p className="text-center text-lg sm:text-xl text-slate-700 dark:text-slate-400 font-extralight ">
              This Varification step is Essential for Policy and using our
              Service without Verification We aren't able to provide you any
              Service at all
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
