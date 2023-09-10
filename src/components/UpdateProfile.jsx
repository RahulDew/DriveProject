import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// import Logo from "./Logo";
import Logo from "./logo";
import { FiMoon, FiUploadCloud } from "react-icons/fi";
import { MdOutlineErrorOutline } from "react-icons/md";

import { Formik } from "formik";
import * as yup from "yup";
import Dropzone, { useDropzone } from "react-dropzone";

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

import { updateProfile, sendEmailVerification } from "firebase/auth";
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
  profileImageFile: yup
    .mixed()
    .nullable()
    .test(
      "FILE_SIZE",
      "File size is greater then 650KB!!!",
      (value) => !value || (value && value.size <= 650000)
    )
    .test(
      "FILE_FORMAT",
      "Uploaded file should be jpg, jpeg or png!!!",
      (value) =>
        !value ||
        (value &&
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            value.type
          ))
    ),
});

const UpdateProfile = () => {
  const [fileUploadStatus, setFileUploadStatus] = useState(null);

  const { currentUser } = useAuthContext();
  const Navigate = useNavigate();

  const id = uuidV4();
  // console.log(fileUploadStatus);
  // const maxSize = 1048576;

  const typeValidator = (file) => {
    if (file.type.startsWith("image/")) {
      if (file.size > 1024 * 1024) {
        // 3MB limit
        return {
          code: "size-too-large",
          message: "File is larger than 1MB",
        };
      }
    }
    return null;
  };

  const DropUpload = ({ setFieldValue, values }) => {
    // const { setFieldValue } = props;
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      acceptedFiles,
      fileRejections,
    } = useDropzone({
      accept: {
        "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
      },
      onDrop: (acceptedFiles) => {
        setFieldValue("profileImageFile", acceptedFiles[0]);
      },
      // multiple: false,
      maxFiles: 1,
      // maxSize: 1048576,
      validator: typeValidator,
    });

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
      <div key={file.path}>
        {/* {file.path} - {file.size} bytes */}
        {/* <ul> */}
        {errors.map((e) => (
          <p key={e.code}>{e.message}</p>
        ))}
        {/* </ul> */}
      </div>
    ));

    return (
      <div
        {...getRootProps()}
        className={`${
          isDragReject && "bg-red-200"
        } p-3 h-32 w-full cursor-copy`}
      >
        <input {...getInputProps()} />
        <div className="h-full flex flex-col justify-center items-center">
          <>
            <FiUploadCloud
              className={`text-4xl ${
                values.profileImageFile ? "text-blue-600" : "text-slate-500"
              }`}
            />
            {isDragReject && (
              <p className="text-red-500">file is not accepctable</p>
            )}
            {!values.profileImageFile ? (
              <p className="text-slate-600">Add or Drop Picture here...</p>
            ) : (
              <p className="text-blue-600 font-semibold">
                {values.profileImageFile && values.profileImageFile.name}
              </p>
            )}
          </>
          <div className="text-red-500">{fileRejectionItems}</div>
        </div>
      </div>
    );
  };

  const handleFormikProfileUpdate = async (values, onSubmitProps) => {
    // console.log(values);
    if (values.profileImageFile.size > 600000) {
      console.log(
        "profileImageFile size is greater then 600KB !!!: " +
          values.profileImageFile.size / 1000 +
          "KB"
      );
    }

    // setFileUploadStatus({
    //   id: id,
    //   name: values.profileImageFile.name,
    //   progress: 0,
    //   error: false,
    // });

    // handling from
    const profilePhotoRef = ref(
      storage,
      `/profile/${currentUser.uid}/${currentUser.email + "_profile_picutre"}`
    );

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
        console.log("error se:", fileUploadStatus);
        setFileUploadStatus({
          ...fileUploadStatus,
          id: id,
          name: values.profileImageFile.name,
          progress: progress,
          error: err,
        });
      },
      async () => {
        //gettting the file URL
        const profilePictureUrl = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("File is uploaded here's link: ", profilePictureUrl);
        // profilePictureUrl = fileUrl;

        //updating profile
        await updateProfile(currentUser, {
          displayName: values.username,
          photoURL: profilePictureUrl,
        });

        // creating document to firestore database
        const q = query(
          database.users,
          where("email", "==", currentUser.email),
          where("userId", "==", currentUser.uid)
        );
        const oldUserDocRef = await getDocs(q);
        const formattedOldUserDoc = oldUserDocRef.docs.map(
          formatter.formatDoc
        )[0];
        console.log("formattedOldUserDoc exists: ", formattedOldUserDoc);

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

        // //removing file uploading from the UploadingProfilePicture state
        setFileUploadStatus(null);
        onSubmitProps.resetForm();
        Navigate("/verifyEmail", { replace: true });
      }
    );

    // if (currentUser.emailVerified) {
    // } else {
    //   alert("Bhai inka verify nhi h email");
    // }
  };

  return (
    <div className="text-center min-h-screen flex flex-col justify-center px-16 py-6 bg-[#E2EFFF]">
      <div className="special_gradient"></div>
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center justify-center gap-3">
          <Logo />
          <h2 className="text-3xl text-black font-bold">Stasher</h2>
        </div>
        <div className="shadow-lg cursor-pointer p-2 bg-blue-600 text-white w-10 h-10 flex justify-center items-center rounded-full text-2xl">
          <FiMoon />
        </div>
      </div>

      {/* <div>

        </div> */}

      <div className="z-40 ">
        <div className="w-full flex justify-center items-center ">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-7">
            <p className="text-center text-3xl tracking-tight text-slate-700 font-semibold">
              Hey, {currentUser.email}
            </p>
            <h2 className="text-center text-6xl font-bold tracking-tight text-gray-900">
              We Got You Dude
            </h2>
            <p className="text-center text-2xl tracking-tight text-slate-700 font-light">
              Please Complete your profile, Ensuring that your Data will be Safe
              and Secure and we don't share your information with anyone...
            </p>
          </div>

          {/* update profile Form */}
          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="">
              <h2 className="mt-10 text-center text-3xl  font-bold leading-9 tracking-tight text-gray-900">
                {currentUser.email}
              </h2>
              <p className="mt-5 text-center text-2xl tracking-tight text-slate-700 font-light">
                Just few steps to go
              </p>
            </div>
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
                    <label className="text-base font-medium leading-6 text-slate-700">
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
                        className="w-full rounded-md p-2 text-[17px] outline-none text-black bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
                      />
                      {touched.username && errors.username && (
                        <div className="flex gap-2 items-center text-red-500 text-left text-sm">
                          <MdOutlineErrorOutline />
                          <p>{touched.username && errors.username}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <label className="text-base font-medium leading-6 text-slate-700">
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
                        className="w-full rounded-md p-2 text-[17px] outline-none text-black bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
                      />
                      {/* <p className="text-red-500 text-left text-sm">
                        {touched.fullName && errors.fullName}
                      </p> */}
                      {touched.fullName && errors.fullName && (
                        <div className="flex gap-2 items-center text-red-500 text-left text-sm">
                          <MdOutlineErrorOutline />
                          <p>{touched.fullName && errors.fullName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <label className="text-base font-medium leading-6 text-slate-700">
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
                        className="w-full rounded-md p-2 text-[17px] outline-none text-black bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
                      />
                      {touched.DOB && errors.DOB && (
                        <div className="flex gap-2 items-center text-red-500 text-left text-sm">
                          <MdOutlineErrorOutline />
                          <p>{touched.DOB && errors.DOB}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className="flex flex-col justify-start items-start">
                    <label className="text-base font-medium leading-6 text-slate-700">
                      Profile Image File
                    </label>
                    <div className="mt-2 w-full">
                      <input
                        type="file"
                        name="profileImageFile"
                        id="profileImageFile"
                        // value={values.profileImageFile}
                        onChange={(e) =>
                          setFieldValue(
                            "profileImageFile",
                            e.currentTarget.files[0]
                          )
                        }
                        onBlur={handleBlur}
                        className="w-full rounded-md p-2 text-[17px] outline-none text-black bg-transparent border-2 border-slate-500 focus:border-blue-600 duration-300"
                      />
                      <p className="text-red-500 text-left text-sm">
                        {touched.profileImageFile && errors.profileImageFile}
                      </p>
                    </div>
                  </div> */}
                  <div className="flex flex-col justify-start items-start">
                    <label className="text-base font-medium leading-6 text-slate-700">
                      Profile Image File
                    </label>
                    <div
                      className={`w-full border-2 border-dashed ${
                        values.profileImageFile
                          ? "border-blue-600"
                          : "border-slate-500"
                      } rounded-md my-2`}
                    >
                      <DropUpload
                        values={values}
                        setFieldValue={setFieldValue}
                      />

                      {/* <Dropzone
                        acceptedFiles=".jpg, .jpeg, .png, .webp"
                        multiple={false}
                        onDrop={(acceptedFiles) =>
                          setFieldValue("profileImageFile", acceptedFiles[0])
                        }
                        // maxSize={1048576}
                        // onBlur={handleBlur}
                        // onChange={handleChange}
                        // name="profileImageFile"
                        // id="profileImageFile"
                        // onChange={handleChange}
                      >
                        {({
                          getInputProps,
                          getRootProps,
                          isDragActive,
                          isDragReject,
                          isDragAccept,
                        }) => (
                          <div
                            {...getRootProps()}
                            className="p-3 w-full cursor-copy"
                          >
                            <input {...getInputProps()} />
                            <div className="flex flex-col justify-center items-center">
                              
                              <>
                                <FiUploadCloud
                                  className={`text-4xl ${
                                    values.profileImageFile
                                      ? "text-blue-600"
                                      : "text-slate-500"
                                  }`}
                                />
                                {!values.profileImageFile ? (
                                  <p className="text-slate-600">
                                    Add or Drop Picture here...
                                  </p>
                                ) : (
                                  <p className="text-blue-600 font-semibold">
                                    {values.profileImageFile &&
                                      values.profileImageFile.name}
                                  </p>
                                )}
                              </>
                            </div>
                          </div>
                        )}
                      </Dropzone> */}
                      <p className="text-red-500 text-left text-sm">
                        {touched.profileImageFile && errors.profileImageFile}
                      </p>
                    </div>
                  </div>
                  {fileUploadStatus && (
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
                            <span>
                              {Math.round(fileUploadStatus.progress)}%
                            </span>
                          </div>
                        ) : (
                          <p>Error...!!!</p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="">
                    <button
                      type="submit"
                      className={` ${
                        fileUploadStatus && "cursor-not-allowed"
                      } shadow-lg mt- flex w-full justify-center mt-5 rounded-md outline-none bg-blue-600 p-3  text-base font-semibold text-white focus:bg-blue-700 hover:bg-blue-700 duration-300`}
                    >
                      {fileUploadStatus
                        ? "Updating Profile..."
                        : "Update Profile"}
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
      </div>
    </div>
  );
};

export default UpdateProfile;
