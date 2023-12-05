import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Formik } from "formik";
import * as yup from "yup";
import FileDropZone from "../widgits/FileDropZone";

import { useAuthContext } from "../context/AuthContext";

import { database, formatter } from "../config/firebase";
import {
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { v4 as uuidV4 } from "uuid";

import { updateProfile } from "firebase/auth";
import { storage } from "../config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { pageTitle } from "../utils";

const initialProfileValues = {
  username: "",
  fullName: "",
  DOB: "",
  profileImageFile: null,
};

const profileSchema = yup.object().shape({
  username: yup
    .string()
    .required("Required!")
    .max(15, "Must be not greater then 15 characters!")
    .min(5, "Must be atleast 5 characters")
    .trim()
    .nonNullable(),
  fullName: yup
    .string()
    .required("Required!")
    .max(50, "Must be not greater then 50 characters!")
    .min(3, "Must be atleast 3 characters")
    .trim()
    .nonNullable(),
  DOB: yup.date().required("Required!"),
  profileImageFile: yup.mixed().nullable(),
});

const UpdateProfile = ({ auth }) => {
  const [fileUploadStatus, setFileUploadStatus] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  pageTitle("Update Profile | Stasher");

  const { currentUser } = useAuthContext();
  const Navigate = useNavigate();

  const handleFormikProfileUpdate = async (values, onSubmitProps) => {
    // console.log(values);
    // if (values.profileImageFile.size > 600000) {
    //   console.log(
    //     "profileImageFile size is greater then 600KB !!!: " +
    //       values.profileImageFile.size / 1000 +
    //       "KB"
    //   );
    // }

    // setFileUploadStatus(true);
    setIsUpdatingProfile(true);

    const id = uuidV4();
    // query to get the current user profile document
    const getProfileQuery = query(
      database.users,
      where("email", "==", currentUser.email),
      where("userId", "==", currentUser.uid)
    );

    const oldUserDocRef = await getDocs(getProfileQuery);
    const formattedOldUserDoc = oldUserDocRef.docs.map(formatter.formatDoc)[0];
    // console.log("formattedOldUserDoc exists: ", formattedOldUserDoc);

    // setFileUploadStatus({
    //   id: id,
    //   name: values.profileImageFile.name,
    //   progress: 0,
    //   error: false,
    // });

    if (values.profileImageFile) {
      // console.log(
      //   "bhai profileImageFile h isliye file bhi upload or update kr rha hu !"
      // );
      // creating storage reference for profile image file
      const profilePhotoRef = ref(
        storage,
        `/profile/${currentUser.uid}/${currentUser.email + "_profile_picutre"}`
      );
      // uploading the profile image file
      const uploadTask = uploadBytesResumable(
        profilePhotoRef,
        values.profileImageFile
      );
      // console.log("File is uploading: ", uploadTask);

      //uploading image and creating or updating user document
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setFileUploadStatus({
            ...fileUploadStatus,
            id: id,
            name: values.profileImageFile.name,
            progress: progress,
            error: false,
          });
        },
        (err) => {
          // managing error when uploading
          // console.log("error se:", fileUploadStatus);
          setFileUploadStatus({
            ...fileUploadStatus,
            id: id,
            name: values.profileImageFile.name,
            progress: progress,
            error: err,
          });
        },
        async () => {
          //getting the file URL
          const profilePictureUrl = await getDownloadURL(
            uploadTask.snapshot.ref
          );
          // console.log("File is uploaded here's link: ", profilePictureUrl);

          //updating currentUser's displayName(username) and photoURL(profile image)
          await updateProfile(currentUser, {
            displayName: values.username,
            photoURL: profilePictureUrl,
          });

          // creating document to firestore database
          if (formattedOldUserDoc) {
            // console.log("updating the old  user document...");
            const userDocRef = doc(database.users, formattedOldUserDoc.id);
            await updateDoc(userDocRef, {
              username: values.username,
              fullName: values.fullName,
              DOB: values.DOB,
              photoURL: profilePictureUrl,
            });
            // console.log("Updated the old Document");
          } else {
            // console.log("creating a new user document...");
            const newUserDoc = await addDoc(database.users, {
              userId: currentUser.uid,
              email: currentUser.email,
              emailVerified: currentUser.emailVerified,
              username: values.username,
              fullName: values.fullName,
              DOB: values.DOB,
              photoURL: profilePictureUrl,
              createdAt: database.currentTimeStamp,
            });
            // console.log("newUserDoc Created: ", newUserDoc);
          }

          //removing file uploading from the UploadingProfilePicture state
          setFileUploadStatus(null);
          setIsUpdatingProfile(false);
          onSubmitProps.resetForm();
          if (currentUser.emailVerified) {
            Navigate("/profile", { replace: true });
          } else {
            Navigate("/auth/verifyEmail", { replace: true });
          }
        }
      );
    } else {
      // console.log(
      //   "bhai profileImageFile nhi h isliye direct documentt create kr rha hu!"
      // );
      setFileUploadStatus(true);
      // updating the currentUser displayName(username)
      await updateProfile(currentUser, {
        displayName: values.username,
      });
      // creating or updating document to firestore database without profile image
      if (formattedOldUserDoc) {
        // console.log("updating the old  user document...");
        const userDocRef = doc(database.users, formattedOldUserDoc.id);
        await updateDoc(userDocRef, {
          username: values.username,
          fullName: values.fullName,
          DOB: values.DOB,
          // photoURL: profilePictureUrl,
        });
        // console.log("Updated the old Document");
      } else {
        // console.log("creating a new user document...");
        const newUserDoc = await addDoc(database.users, {
          userId: currentUser.uid,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified,
          username: values.username,
          fullName: values.fullName,
          DOB: values.DOB,
          // photoURL: profilePictureUrl,
          createdAt: database.currentTimeStamp,
        });
        // console.log("newUserDoc Created: ", newUserDoc);
      }

      //setting setIsUpdatingProfile state to false
      setIsUpdatingProfile(false);

      onSubmitProps.resetForm();
      if (currentUser.emailVerified) {
        Navigate("/profile", { replace: true });
      } else {
        Navigate("/auth/verifyEmail", { replace: true });
      }
    }
  };

  return (
    <div className="w-full gap-5 py-5">
      {/* left info */}
      {auth ? (
        <div className="mx-auto w-full sm:w-5/6 lg:w-3/6 flex flex-col justify-center items-center gap-7">
          <p className="text-center text-2xl tracking-tight text-slate-700 dark:text-slate-400 font-semibold">
            <span className="block">Hey,</span> {currentUser.email}
          </p>
          <>
            <h2 className="text-center text-5xl md:text-6xl font-bold tracking-tight dark:text-slate-200">
              We Got You, Dude
            </h2>
            <p className="text-center text-xl md:text-2xl tracking-tight text-slate-700 dark:text-slate-400 font-light">
              Please Update your profile, Ensuring that your Data will be Safe
              and Secure and we don't share your information with anyone...
            </p>
            <p className="text-center text-2xl text-slate-700 dark:text-slate-200 font-semibold tracking-tight ">
              Just few steps to go...
            </p>
          </>
        </div>
      ) : (
        <div className="my-4 space-y-4">
          <h2 className="text-center text-5xl font-bold tracking-tight dark:text-slate-200">
            Update Your Profile
          </h2>
          <p className="text-center text-xl md:text-2xl tracking-tight text-slate-700 dark:text-slate-400 font-light">
            Change your profile information and your profile image,
            <span className="block">Profile image is optional</span>
          </p>
        </div>
      )}
      {/* update profile Form */}
      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <Formik
          onSubmit={handleFormikProfileUpdate}
          initialValues={initialProfileValues}
          validationSchema={profileSchema}
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
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col justify-start items-start">
                <label className="text-base font-medium leading-6 text-slate-700 dark:text-slate-200">
                  Username
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ex. john221"
                    required
                    className="w-full rounded-lg p-2 text-[17px] outline-none bg-transparent border-2 border-slate-600 dark:border-slate-600 dark:placeholder:text-slate-500 focus:border-blue-600 duration-300"
                  />

                  {touched.username && (
                    <p className="text-red-500 text-left text-sm mt-1">
                      {touched.username && errors.username}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-start items-start">
                <label className="text-base font-medium leading-6 text-slate-700 dark:text-slate-200">
                  Full Name
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Ex. John Doe"
                    className="w-full rounded-lg p-2 text-[17px] outline-none border-slate-500 dark:border-slate-600 dark:placeholder:text-slate-500 bg-transparent border-2  focus:border-blue-600 duration-300"
                  />

                  {touched.fullName && (
                    <p className="text-red-500 text-left text-sm mt-1">
                      {touched.fullName && errors.fullName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-start items-start">
                <label className="text-base font-medium leading-6 text-slate-700 dark:text-slate-200">
                  Date Of Birth
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="date"
                    name="DOB"
                    id="DOB"
                    value={values.DOB}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="w-full rounded-lg p-2 text-[17px] outline-none bg-transparent border-2 border-slate-500 dark:border-slate-600 dark:placeholder:text-slate-500 focus:border-blue-600 duration-300"
                  />

                  {touched.DOB && (
                    <p className="text-red-500 text-left text-sm mt-1">
                      {touched.DOB && errors.DOB}
                    </p>
                  )}
                </div>
              </div>
              {/* profile photo upload section */}
              <div className="flex flex-col justify-start items-start">
                <label className="text-base font-medium leading-6 text-slate-700 dark:text-slate-200">
                  Profile Image File
                </label>
                <div
                  className={`w-full h-24 border-2 border-dashed ${
                    values.profileImageFile
                      ? "border-blue-600"
                      : "border-slate-500"
                  } rounded-lg my-2 flex justify-center items-center`}
                >
                  <FileDropZone
                    values={values}
                    setFieldValue={setFieldValue}
                    fileType={"image"}
                  />
                  {/* <p className="text-red-500 text-left text-sm">
                        {touched.profileImageFile && errors.profileImageFile}
                      </p> */}
                </div>
              </div>
              {fileUploadStatus && values.profileImageFile && (
                <div className="bg-transparent p-1 rounded-md flex flex-col gap-2">
                  {/* Progress Barand and State */}
                  <div className="w-full h-2 rounded-full">
                    <div
                      style={{
                        width: `${Math.round(fileUploadStatus.progress)}%`,
                      }}
                      className={`h-full rounded-sm text-white text-xs transition-all duration-300 ease-out bg-gradient-to-r from-cyan-700 ${
                        !fileUploadStatus.error
                          ? " to-blue-700  "
                          : "to-red-400"
                      }`}
                    ></div>
                  </div>
                  <div className="text-center text-sm">
                    {!fileUploadStatus.error ? (
                      <div className="flex justify-between">
                        <p>Uploading...</p>
                        <span>{Math.round(fileUploadStatus.progress)}%</span>
                      </div>
                    ) : (
                      <p>Error...!!!</p>
                    )}
                  </div>
                </div>
              )}
              <div>
                <button
                  type="submit"
                  disabled={isUpdatingProfile ? true : false}
                  className={` ${
                    isUpdatingProfile && "cursor-not-allowed"
                  } shadow-lg mt- flex w-full justify-center mt-5 rounded-lg outline-none bg-blue-600 p-3  text-base font-semibold text-white focus:bg-blue-700 hover:bg-blue-700 duration-300`}
                >
                  {isUpdatingProfile ? (
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
                      <span>Updating Profile...</span>
                    </div>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </form>
          )}
        </Formik>

        {/* <h3 className="my-3 font-semibold text-red-500">
        {authError && authError}
      </h3> */}
      </div>
    </div>
  );
};

export default UpdateProfile;
