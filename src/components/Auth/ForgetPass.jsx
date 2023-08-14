import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";

const ForgetPass = () => {
  const emailRef = useRef();

  const Navigate = useNavigate();

  const { resetPassword } = useAuthContext();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(emailRef.current.value);
      console.log("Check your inbox for further instructions!");
      Navigate("/login", { replace: true });
    } catch (error) {
      setError(error);
      console.log("user does not exist", error);
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
            Want to Reset your Account Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 p-3  text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset Password
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Remember your Accout Password?
            <a
              href="login"
              className="font-semibold mx-2 leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </a>
            {/* <Link to="login" classNameName="font-semibold mx-2 leading-6 text-indigo-600 hover:text-indigo-500">yes Login</Link> */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
