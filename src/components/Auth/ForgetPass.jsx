import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";

import { Formik } from "formik";

import { motion } from "framer-motion";
import { pageTitle } from "../../utils";
import {
  FORGET_PASSWORD_SCHEMA,
  INITIAL_FORGET_PASSWORD_VALUES,
} from "../../constants/constants";


const ForgetPass = () => {
  pageTitle("Reset Password | Stasher");

  const Navigate = useNavigate();

  const {
    resetPassword,
    authLoading,
    setAuthLoading,
    authError,
    handleAuthError,
  } = useAuthContext();

  const handleFormikForgetPassword = async (values, onSubmitProps) => {
    // console.log(values);
    setAuthLoading(true);
    try {
      await resetPassword(values.email);
      // console.log("Check your inbox for further instructions!");
      onSubmitProps.resetForm();
      setAuthLoading(false);
      Navigate("/auth/login", { replace: true });
    } catch (error) {
      // console.log(error);
      if (error.code == "auth/user-not-found") {
        // console.log("There is no account with this email");
        handleAuthError("There is no account with this email!!!");
      } else {
        // console.log("Can't able to send forget password link");
        handleAuthError("Failed to send forget password reset email!!!");
      }
    }
    setAuthLoading(false);
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-7 space-y-5">
      <div className="text-black dark:text-slate-200">
        <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight">
          Forgot the password
        </h2>
        <h2 className="mt-5 text-center text-2xl tracking-tight font-light">
          Don't worry Dude, we are here
        </h2>
      </div>

      {/* form container */}
      <div>
        <Formik
          onSubmit={handleFormikForgetPassword}
          initialValues={INITIAL_FORGET_PASSWORD_VALUES}
          validationSchema={FORGET_PASSWORD_SCHEMA}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="space-y-3 text-slate-700 dark:text-slate-400"
            >
              <div className="flex flex-col justify-start items-start">
                <label className="text-base font-medium leading-6">
                  Email address
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ex. johndoe@email.com"
                    required
                    className="w-full rounded-lg p-2 text-[17px] outline-none text-black dark:text-slate-300 placeholder:text-slate-500  bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
                  />

                  <motion.p
                    initial={{ opacity: 0.5, y: "-3px" }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-left text-sm mt-1"
                  >
                    {touched.email && errors.email}
                  </motion.p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="shadow-lg flex w-full justify-center mt-5 rounded-lg outline-none bg-blue-600 p-3  text-base font-semibold text-white focus:bg-blue-700 hover:bg-blue-700 duration-300"
                >
                  {authLoading ? (
                    <div className="flex justify-center items-center">
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill=""
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </form>
          )}
        </Formik>

        <h3 className="my-3 font-semibold text-red-500">
          {authError && authError}
        </h3>

        <p className="mt-5 text-center text-sm text-slate-700 dark:text-slate-300">
          Don't Have Account?
          <Link
            to={"/auth/signup"}
            className="font-semibold mx-2 leading-6 text-blue-600 hover:text-blue-500"
          >
            Signup
          </Link>
        </p>
      </div>
      {/* navigation message */}
      <div className="text-center text-2xl tracking-tight font-light">
        we will send you password reset email with the varification email from
        <span className="text-blue-600 mx-2">
          noreply@fir-crud-app-1f464.firebaseapp.com
        </span>
      </div>
    </div>
  );
};

export default ForgetPass;
