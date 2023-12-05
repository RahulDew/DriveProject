import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";

import { Formik } from "formik";
import * as yup from "yup";
import { motion } from "framer-motion";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import GoogleSignin from "../../widgits/GoogleSignin";
import { pageTitle } from "../../utils";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  pageTitle("Login | Stasher");

  const Navigate = useNavigate();

  const {
    logIn,
    signInWithGoogle,
    authLoading,
    setAuthLoading,
    authError,
    handleAuthError,
  } = useAuthContext();

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid Email")
      .required("Required!")
      .max(50, "Must be not greater then 50 characters!"),
    password: yup.string().required("Required!"),
    // .min(8, "Must contain atleast 8 characters!"),
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,49}$/,
    //   "Must contain 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number"
    // ),
  });

  // initial values for all fields to signup form
  const initialLoginValues = {
    email: "",
    password: "",
  };

  const handleFormikLogin = async (values, onSubmitProps) => {
    setAuthLoading(true);
    try {
      const loggedUser = await logIn(values.email, values.password);
      onSubmitProps.resetForm();
      if (loggedUser.user.uid) Navigate("/", { replace: true });
    } catch (error) {
      if (
        error.code == "auth/invalid-email" ||
        error.code == "auth/wrong-password"
      ) {
        // console.log("Your email or password was incorrect!");
        handleAuthError("Your email or password was incorrect!!!");
      } else {
        // console.log("Can't able to create an account, Please try again!!!");
        handleAuthError("Can't able to create an account, Please try again!!!");
      }
    }
    setAuthLoading(false);
  };

  const handleGoogleLogIn = async () => {
    try {
      const loggedUser = await signInWithGoogle();
      // console.log(loggedUser);
      if (loggedUser) Navigate("/", { replace: true });
    } catch (error) {
      // console.log("can't with google:", error);
      handleAuthError("can't login with google!");
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="text-black dark:text-slate-200">
        <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight">
          Welcome Back
        </h2>
        <h2 className="mt-5 text-center text-2xl tracking-tight font-light">
          Dude, Happy to see you Again
        </h2>
      </div>

      <div className="mt-5">
        <Formik
          onSubmit={handleFormikLogin}
          initialValues={initialLoginValues}
          validationSchema={loginSchema}
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
                    className="w-full rounded-lg p-2 text-[17px] outline-none text-black dark:text-slate-300 placeholder:text-slate-500 bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
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

              <div className=" relative flex flex-col justify-start items-start">
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
                    className="w-full rounded-lg p-2 text-[17px] outline-none text-black dark:text-slate-300 placeholder:text-slate-500 bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
                  />

                  {/* password visibility changer */}
                  <div
                    onClick={() =>
                      setShowPassword((prevShowPassword) => !prevShowPassword)
                    }
                    className="absolute right-3 top-11 text-[22px] hover:text-blue-600 duration-200 cursor-pointer"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </div>

                  <motion.p
                    initial={{ opacity: 0.5, y: "-3px" }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-left text-sm mt-1"
                  >
                    {touched.password && errors.password}
                  </motion.p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="shadow-lg mt- flex w-full justify-center mt-5 rounded-lg outline-none bg-blue-600 p-3  text-base font-semibold text-white focus:bg-blue-700 hover:bg-blue-700 duration-300"
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
                      <span>Logging...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          )}
        </Formik>

        <h3 className="my-3 font-semibold text-red-500">
          {authError && authError}
        </h3>

        {/* porget password page navigator */}
        <Link
          to={"/auth/forgot-password"}
          className="font-semibold mx-2 leading-6 text-blue-600 hover:text-blue-500"
        >
          Forgot password?
        </Link>

        <hr className=" border-blue-600 my-5" />

        {/* Google Login Button */}
        <GoogleSignin handleGoogleSignIn={handleGoogleLogIn} />

        {/* navigate to signup page */}
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
    </div>
  );
};

export default Login;
