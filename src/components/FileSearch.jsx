import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";

import File from "../components/File";
import Loader from "../components/Loader";

import { motion } from "framer-motion";

import { query, where, onSnapshot } from "firebase/firestore";
import { database } from "../config/firebase";
import { formatter } from "../config/firebase";

import { LuFileSearch } from "react-icons/lu";

import { FiX } from "react-icons/fi";
import {
  FcVideoFile,
  FcAudioFile,
  FcImageFile,
  FcFinePrint,
  FcDocument,
  FcRatings,
} from "react-icons/fc";

const fileSearchSchema = yup.object().shape({
  fileName: yup
    .string()
    .max(20, "File name not greater then 20 characters!")
    .min(2, "File name should have atleast 3 characters!")
    .trim("Your file should have a name")
    .nonNullable("Your file should have a name"),
});

const initialFileSearchValues = {
  fileName: "",
};

const FileSearch = ({ contentLoading, setContentLoading, currentUser }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchedFiles, setSearchedFiles] = useState([]);

  const handleFormikFileSearch = async (values, onSubmitProps) => {
    // console.log(values);
    // console.log(values.fileName.toLowerCase());
    setIsSearching(true);
    const q = query(
      database.files,
      where("userId", "==", currentUser.uid),
      where("fileSearchName", ">=", values.fileName.toLowerCase()),
      where("fileSearchName", "<=", values.fileName.toLowerCase() + "\uf8ff")
    );
    setContentLoading(true);
    // console.log("bhai main usi name ke files la rha hu");
    onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map(formatter.formatDoc);
      // console.log("files: ", files);
      setSearchedFiles(files);
      setContentLoading(false);
    });
    // onSubmitProps.resetForm();
  };

  return (
    <div className="w-full">
      <Formik
        onSubmit={handleFormikFileSearch}
        initialValues={initialFileSearchValues}
        validationSchema={fileSearchSchema}
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
            className="flex flex-col justify-center items-center gap-5"
          >
            {/* input container */}
            <div className="pointer-events-none w-full md:w-5/6 lg:4/6 flex items-center justify-start bg-slate-50 dark:bg-slate-800 shadow-xl hover:shadow-blue-200 focus-within:shadow-blue-200 dark:shadow-none rounded-full p-1.5 sm:p-2 duration-300">
              {/* icon */}
              <div className="bg-blue-600 text-white text-2xl px-5 p-2 sm:ml-1 rounded-full font-bold pointer-events-auto">
                <LuFileSearch />
              </div>

              <input
                type="text"
                name="fileName"
                id="fileName"
                autoFocus={true}
                value={values.fileName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter name of file..."
                className="w-full bg-transparent py-1 px-4 hover:bg-opacity-40 duration-200 outline-none border-none text-[18px] pointer-events-auto"
              />

              {values.fileName && (
                <div
                  onClick={() => {
                    resetForm();
                    setIsSearching(false);
                    setSearchedFiles([]);
                  }}
                  className="text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600 text-2xl px-5 p-2 ml-1 rounded-full cursor-pointer duration-300 pointer-events-auto"
                >
                  <FiX />
                </div>
              )}
            </div>
            {/* fileName input error */}
            <motion.p
              initial={{ opacity: 0.5, y: "-3px" }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-500 text-left text-base duration-200 transition-all"
            >
              {touched.fileName && errors.fileName}
            </motion.p>
          </form>
        )}
      </Formik>

      <hr className="font-bold border-slate-300  dark:border-slate-800 my-8 duration-200" />

      {/* logic for showing files starts here */}
      {isSearching ? (
        <>
          {!contentLoading ? (
            <>
              {searchedFiles.length ? (
                <div className="flex flex-row flex-wrap justify-center items-center gap-8 ">
                  {searchedFiles
                    .map((file) => (
                      <div key={file.id}>
                        <File file={file} />
                      </div>
                    ))
                    .reverse()}
                </div>
              ) : (
                <div className="mt-24">
                  <h3 className="text-2xl font-light">
                    Sorry ! We don't have file with this name
                    {/* <span className="text-blue-600">{searchText}</span> */}
                  </h3>
                  <div className="mt-5 flex justify-center items-center gap-3 opacity-40">
                    <FcFinePrint className="text-9xl " />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          )}
        </>
      ) : (
        <div className="mt-24">
          <h3 className="text-2xl font-light">
            Find your all files in one place
          </h3>
          <div className="mt-5 flex flex-wrap gap-2 justify-center items-center text-7xl sm:text-8xl md:text-9xl">
            <FcDocument />
            <FcImageFile />
            <FcAudioFile />
            <FcVideoFile />
            <FcRatings />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSearch;
