import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// imports for form validation
import { Formik } from "formik";
import * as yup from "yup";
import { MdOutlineErrorOutline } from "react-icons/md";

import { useAuthContext } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import GoogleSignin from "../../widgits/GoogleSignin";

// creating schema using yup library for validation
const signupSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email")
    .required("Required!")
    .max(50, "Must be not greater then 50 characters!"),
  password: yup.string().required("Required!"),
  // .min(8, "Must contain atleast 8 characters!")
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,49}$/,
  //   "Must contain 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number"
  // ),
  confirmPassword: yup
    .string()
    .required("Required!")
    // .min(8, "Must be atleast 8 characters!")
    .oneOf([yup.ref("password")], "Please Enter same password!!!"),
});

// initial values for all fields to signup form
const initialSignupValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const Navigate = useNavigate();

  const {
    signUp,
    signInWithGoogle,
    authLoading,
    setAuthLoading,
    authError,
    setAuthError,
  } = useAuthContext();

  const handleGoogleSignUp = async () => {
    try {
      const newUser = await signInWithGoogle();
      if (newUser) Navigate("/", { replace: true });
      console.log(newUser);
    } catch (error) {
      console.log("can't with google:", error);
    }
  };

  const handleFormikSignup = async (values, onSubmitProps) => {
    // console.log(values);
    setAuthLoading(true);
    try {
      const newUser = await signUp(values.email, values.password);
      onSubmitProps.resetForm();
      console.log("printing newuser from signup from: ", newUser);
      if (newUser.uid) Navigate("/updateProfile", { replace: true });
    } catch (error) {
      console.log("can't create a user: ", error);
      // console.log("error code: ", error.code);
      // console.log("error message: ", error.message);
      if (error.code == "auth/email-already-in-use") {
        // console.log("Email is already in use, Please try with different email!");
        setAuthError(
          "Email is already in use, Please try with different email!!!"
        );
      } else {
        // console.log("Can't able to create an account, Please try again!!!");
        setAuthError("Can't able to create an account, Please try again!!!");
      }
    }
    setAuthLoading(false);
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="text-black dark:text-slate-200">
        <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight">
          Sign Up
        </h2>
        <h2 className="mt-5 text-center text-2xl tracking-tight font-light">
          Make Your Memories
        </h2>
      </div>

      <div className="mt-5">
        <Formik
          onSubmit={handleFormikSignup}
          initialValues={initialSignupValues}
          validationSchema={signupSchema}
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
              {/* input email */}
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
                    className="w-full rounded-md p-2 text-[17px] outline-none text-black dark:text-slate-300 placeholder:text-slate-500 bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
                  />
                  {touched.email && (
                    <p className="text-red-500 text-left text-sm mt-1">
                      {touched.email && errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* input password */}
              <div className="flex flex-col justify-start items-start">
                <label className="text-base font-medium leading-6">
                  Password
                </label>
                <div className="mt-2 w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Ex. ......"
                    className="w-full rounded-md p-2 text-[17px] outline-none text-black dark:text-slate-300 placeholder:text-slate-500 bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
                  />
                  {/* <p className="text-red-500 text-left text-sm">
                      {touched.password && errors.password}
                    </p> */}
                  {touched.password && (
                    <p className="text-red-500 text-left text-sm mt-1">
                      {touched.password && errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* input confirm password */}
              <div className="flex flex-col justify-start items-start">
                <label className="text-base font-medium leading-6">
                  Confirm Password
                </label>
                <div className="mt-2 w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ex. ......"
                    required
                    className="w-full rounded-md p-2 text-[17px] outline-none text-black dark:text-slate-300 placeholder:text-slate-500 bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
                  />
                  {touched.confirmPassword && (
                    <p className="text-red-500 text-left text-sm mt-1">
                      {touched.confirmPassword && errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* submit button */}
              <div>
                <button
                  type="submit"
                  className={`${
                    authLoading && "cursor-not-allowed"
                  } shadow-lg flex w-full justify-center mt-5 rounded-md outline-none bg-blue-600 p-3  text-base font-semibold text-white focus:bg-blue-700 hover:bg-blue-700 duration-300`}
                >
                  {authLoading ? "Creating Account..." : "Signup"}
                </button>
              </div>
            </form>
          )}
        </Formik>

        <h3 className="my-3 font-semibold text-red-500">
          {authError && authError}
        </h3>

        <hr className=" border-blue-600 my-5" />

        {/* Google Login Button */}
        <GoogleSignin handleGoogleSignIn={handleGoogleSignUp} />

        <p className="mt-5 text-center text-sm text-slate-700 dark:text-slate-300">
          Already have Account?
          <Link
            to={"/auth/login"}
            className="font-semibold mx-2 leading-6 text-blue-600 hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
