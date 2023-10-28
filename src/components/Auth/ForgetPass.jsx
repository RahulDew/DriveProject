import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";

import { Formik } from "formik";
import * as yup from "yup";
import { MdOutlineErrorOutline } from "react-icons/md";

// forget password schema
const forgetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email")
    .required("Required!")
    .max(50, "Must be not greater then 50 characters!"),
});

// initial values for all fields to signup form
const initialForgetPasswordValues = {
  email: "",
};

const ForgetPass = () => {
  const Navigate = useNavigate();

  const {
    resetPassword,
    authLoading,
    setAuthLoading,
    authError,
    setAuthError,
  } = useAuthContext();
  // const [authError, setAuthError] = useState("");

  // console.log(authLoading);
  // console.log(authError);

  const handleFormikForgetPassword = async (values, onSubmitProps) => {
    console.log(values);
    setAuthLoading(true);
    try {
      await resetPassword(values.email);
      // console.log("Check your inbox for further instructions!");
      onSubmitProps.resetForm();
      setAuthLoading(false);
      Navigate("/auth/login", { replace: true });
    } catch (error) {
      console.log(error);
      if (error.code == "auth/user-not-found") {
        console.log("There is no account with this email");
        setAuthError("There is no account with this email!!!");
      } else {
        console.log("Can't able to send forget password link");
        setAuthError("Can't able to send forget password link!!!");
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

      <div>
        <Formik
          onSubmit={handleFormikForgetPassword}
          initialValues={initialForgetPasswordValues}
          validationSchema={forgetPasswordSchema}
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
                    className="w-full rounded-md p-2 text-[17px] outline-none text-black dark:text-slate-300 placeholder:text-slate-500  bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
                  />

                  {touched.email && (
                    <p className="text-red-500 text-left text-sm mt-1">
                      {touched.email && errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="shadow-lg mt- flex w-full justify-center mt-5 rounded-md outline-none bg-blue-600 p-3  text-base font-semibold text-white focus:bg-blue-700 hover:bg-blue-700 duration-300"
                >
                  {authLoading ? "Sending..." : "Send"}
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
