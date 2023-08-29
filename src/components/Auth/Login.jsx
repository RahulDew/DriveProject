import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { useAuthContext } from "../../context/AuthContext";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const Navigate = useNavigate();
  

  const { logIn, signInWithGoogle } = useAuthContext();

  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await logIn(
        emailRef.current.value,
        passwordRef.current.value
      );
      if (loggedUser) Navigate("/", { replace: true });
    } catch (error) {
      setError(error);
      console.log("user does not exist", error);
    }
  };

  const handleGoogleLogIn = async () => {
    try {
      const loggedUser = await signInWithGoogle();
      console.log(loggedUser);
      if (loggedUser) Navigate("/", { replace: true });
    } catch (error) {
      console.log("can't with google:", error);
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center ">
      <div className="flex min-h-full w-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login to Your Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  ref={emailRef}
                  required
                  className="block w-full rounded-md border-0 p-3 text-lg outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="forgot-password"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  ref={passwordRef}
                  required
                  className="block w-full rounded-md border-0 p-3 text-lg outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 p-3  text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
            </div>
          </form>

          <hr className=" border-indigo-600 my-5" />

          <button
            type="submit"
            onClick={handleGoogleLogIn}
            className="flex w-full justify-center gap-2 rounded-md p-3  text-sm font-semibold leading-6 text-indigo-600 shadow-sm border-2 border-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <FcGoogle className="text-2xl " />
            Signin with google
          </button>

          <p className="mt-5 text-center text-sm text-gray-500">
            Not have Account?
            <Link to={"/signup"}
              // href="/signup"
              className="font-semibold mx-2 leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Signup
            </Link>
            {/* <Link to="login" classNameName="font-semibold mx-2 leading-6 text-indigo-600 hover:text-indigo-500">yes Login</Link> */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
