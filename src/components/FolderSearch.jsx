import React, { useState } from "react";
import { Formik } from "formik";

import Loader from "../components/Loader";

import Folder from "./Folder";
import { motion } from "framer-motion";

import { query, where, onSnapshot } from "firebase/firestore";
import { database } from "../config/firebase";
import { formatter } from "../config/firebase";
import {
  FOLDER_SEARCH_SCHEMA,
  INITIAL_FOLDER_SEARCH_VALUES,
} from "../constants/constants";

import { LuFolderSearch } from "react-icons/lu";

import { FiX } from "react-icons/fi";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";


const FolderSearch = ({ contentLoading, setContentLoading, currentUser }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchedFolders, setSearchedFolders] = useState([]);

  const handleFormikFolerSearch = async (values, onSubmitProps) => {
    // console.log(values);
    // console.log(values.fileName.toLowerCase());
    setIsSearching(true);
    const q = query(
      database.folders,
      where("userId", "==", currentUser.uid),
      where("folderSearchName", ">=", values.folderName.toLowerCase()),
      where(
        "folderSearchName",
        "<=",
        values.folderName.toLowerCase() + "\uf8ff"
      )
    );
    setContentLoading(true);
    // console.log("bhai main usi name ke folders la rha hu");
    onSnapshot(q, (snapshot) => {
      const folders = snapshot.docs.map(formatter.formatDoc);
      // console.log(folders);
      setSearchedFolders(folders);
    });
    setContentLoading(false);
    // onSubmitProps.resetForm();
  };

  return (
    <motion.div className="w-full">
      <Formik
        onSubmit={handleFormikFolerSearch}
        initialValues={INITIAL_FOLDER_SEARCH_VALUES}
        validationSchema={FOLDER_SEARCH_SCHEMA}
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
                <LuFolderSearch />
              </div>

              <input
                type="text"
                name="folderName"
                id="folderName"
                autoFocus={true}
                value={values.folderName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter name of file..."
                className="w-full bg-transparent py-1 px-4 hover:bg-opacity-40 duration-200 outline-none border-none text-[18px] pointer-events-auto"
              />

              {values.folderName && (
                <div
                  onClick={() => {
                    resetForm();
                    setIsSearching(false);
                    setSearchedFolders([]);
                  }}
                  className="text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600 text-2xl px-5 p-2 ml-1 rounded-full cursor-pointer duration-300 pointer-events-auto"
                >
                  <FiX />
                </div>
              )}
            </div>
            {/* folderName input error */}
            <motion.p
              initial={{ opacity: 0.5, y: "-3px" }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-500 text-left text-base duration-200 transition-all"
            >
              {touched.folderName && errors.folderName}
            </motion.p>
          </form>
        )}
      </Formik>

      <hr className="font-bold border-slate-300 dark:border-slate-800 my-8 duration-200" />

      {/* logic for showing files starts here */}
      {isSearching ? (
        <>
          {!contentLoading ? (
            <>
              {searchedFolders.length ? (
                <div className="flex flex-row flex-wrap justify-center items-center gap-8 ">
                  {searchedFolders
                    .map((folder) => (
                      <div key={folder.id}>
                        <Folder folder={folder} />
                      </div>
                    ))
                    .reverse()}
                </div>
              ) : (
                <div className="mt-24">
                  <h3 className="text-2xl font-light">
                    Sorry ! We don't have Folders with this name
                    {/* <span className="text-blue-600">{searchText}</span> */}
                  </h3>
                  <div className="mt-5 flex justify-center items-center gap-3 opacity-40">
                    <FcOpenedFolder className="text-9xl " />
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
            Find your all Folders in one place
          </h3>
          <div className="mt-5 flex justify-center items-center gap-2 opacity-80 text-7xl sm:text-8xl md:text-9xl">
            <FcFolder />
            <FcFolder />
            <FcFolder />
            <FcFolder />
            <FcFolder />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FolderSearch;
