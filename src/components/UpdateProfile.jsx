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
    .max(12, "Must be not greater then 12 characters!"),
  fullName: yup
    .string()
    .required("Required!")
    .max(50, "Must be not greater then 50 characters!"),
  DOB: yup.date().required("Required!"),
  profileImageFile: yup.mixed().nullable(),
});

const UpdateProfile = () => {
  const [fileUploadStatus, setFileUploadStatus] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

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
    console.log("formattedOldUserDoc exists: ", formattedOldUserDoc);

    // setFileUploadStatus({
    //   id: id,
    //   name: values.profileImageFile.name,
    //   progress: 0,
    //   error: false,
    // });

    if (values.profileImageFile) {
      console.log(
        "bhai profileImageFile h isliye file bhi upload or update kr rha hu !"
      );
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
      console.log("File is uploading: ", uploadTask);

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
          console.log("File is uploaded here's link: ", profilePictureUrl);

          //updating currentUser's displayName(username) and photoURL(profile image)
          await updateProfile(currentUser, {
            displayName: values.username,
            photoURL: profilePictureUrl,
          });

          // creating document to firestore database
          if (formattedOldUserDoc) {
            console.log("updating the old  user document...");
            const userDocRef = doc(database.users, formattedOldUserDoc.id);
            await updateDoc(userDocRef, {
              username: values.username,
              fullName: values.fullName,
              DOB: values.DOB,
              photoURL: profilePictureUrl,
            });
            console.log("Updated the old Document");
          } else {
            console.log("creating a new user document...");
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
            console.log("newUserDoc Created: ", newUserDoc);
          }

          //removing file uploading from the UploadingProfilePicture state
          setFileUploadStatus(null);
          setIsUpdatingProfile(false);
          onSubmitProps.resetForm();
          if (currentUser.emailVerified) {
            Navigate("/", { replace: true });
          } else {
            Navigate("/auth/verifyEmail", { replace: true });
          }
        }
      );
    } else {
      console.log(
        "bhai profileImageFile nhi h isliye direct documentt create kr rha hu!"
      );
      setFileUploadStatus(true);
      // updating the currentUser displayName(username)
      await updateProfile(currentUser, {
        displayName: values.username,
      });
      // creating or updating document to firestore database without profile image
      if (formattedOldUserDoc) {
        console.log("updating the old  user document...");
        const userDocRef = doc(database.users, formattedOldUserDoc.id);
        await updateDoc(userDocRef, {
          username: values.username,
          fullName: values.fullName,
          DOB: values.DOB,
          // photoURL: profilePictureUrl,
        });
        console.log("Updated the old Document");
      } else {
        console.log("creating a new user document...");
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
        console.log("newUserDoc Created: ", newUserDoc);
      }

      //setting setIsUpdatingProfile state to false
      setIsUpdatingProfile(false);

      onSubmitProps.resetForm();
      if (currentUser.emailVerified) {
        Navigate("/", { replace: true });
      } else {
        Navigate("/auth/verifyEmail", { replace: true });
      }
    }
  };

  return (
    <div className="w-full gap-5 py-5">
      {/* left info */}
      <div className="mx-auto w-full sm:w-5/6 lg:w-3/6 flex flex-col justify-center items-center gap-7">
        <p className="text-center text-2xl tracking-tight text-slate-700 dark:text-slate-400 font-semibold">
          <span className="block">Hey,</span> {currentUser.email}
        </p>
        <h2 className="text-center text-5xl md:text-6xl font-bold tracking-tight dark:text-slate-200">
          We Got You, Dude
        </h2>
        <p className="text-center text-xl md:text-2xl tracking-tight text-slate-700 dark:text-slate-400 font-light">
          Please Update your profile, Ensuring that your Data will be Safe and
          Secure and we don't share your information with anyone...
        </p>
      </div>

      {/* update profile Form */}
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="my-4 text-center text-2xl text-slate-700 dark:text-slate-200 font-semibold tracking-tight ">
          Just few steps to go...
        </p>

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
                  {isUpdatingProfile ? "Updating Profile..." : "Update Profile"}
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
