import React, { useState } from "react";
import { database } from "../config/firebase";
import { addDoc } from "firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { motion } from "framer-motion";

import { Formik } from "formik";
import * as yup from "yup";
import { MdOutlineErrorOutline } from "react-icons/md";
import { AiFillFolderAdd } from "react-icons/ai";
import { TbFolderPlus } from "react-icons/tb";

// creating schema using yup library for validation
const newFolderSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter valid folder name")
    // .max(20, "Folder name not greater then 20 characters!")
    .min(3, "Folder name should have atleast 3 characters!")
    .trim()
    .nonNullable(),
});

// initial values for folder
const initialFolderValues = {
  name: "",
};

const AddFolderButton = ({ icon, currentFolder, mobileNav }) => {
  const [modelOpen, setModelOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const { currentUser, handleShowToast } = useAuthContext();

  const handleFormikCreateFolder = async (values, onSubmitProps) => {
    try {
      if (currentFolder === null || currentFolder === undefined) return; //if currentfolder is null then return

      // activate loader
      setLoader(true);

      //creating path for folder
      const path = [...currentFolder.path];
      if (currentFolder !== ROOT_FOLDER) {
        path.push({ name: currentFolder.name, id: currentFolder.id });
      }

      // Creating folder in databse
      await addDoc(database.folders, {
        name: values.name,
        folderSearchName: values.name.toLowerCase(),
        userId: currentUser.uid,
        parentId: currentFolder.id,
        path: path,
        createdAt: database.currentTimeStamp,
      });

      handleShowToast(`Folder ${values.name} created.`, "success");
    } catch (error) {
      console.log(error);
      alert("Failed to create folder!");
      handleShowToast(`Failed to create folder!`, "failure");
    }
    onSubmitProps.resetForm();
    setLoader(false);
    setModelOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setModelOpen(true)}
        className={`cursor-pointer text-2xl p-2 
          bg-blue-600 text-white hover:bg-blue-700 
        flex justify-center items-center gap-1 rounded-xl shadow-md duration-300 font-semibold`}
      >
        <TbFolderPlus />

        <div className="hidden md:block text-lg b-2">Folder</div>
      </button>

      {/* Add Folder or File Model */}
      {modelOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div
            onClick={() => setModelOpen(false)}
            className={
              "fixed inset-0 bg-gray-800 opacity-70 dark:bg-slate-950 dark:opacity-80 transition-opacity"
            }
          ></div>
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              {/* main content */}
              <div className="p-6 sm:p-6">
                <Formik
                  onSubmit={handleFormikCreateFolder}
                  initialValues={initialFolderValues}
                  validationSchema={newFolderSchema}
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
                      className="w-full flex flex-col justify-center items-center gap-4"
                    >
                      <div className="flex justify-start items-start w-full">
                        <label className="font-semibold text-xl text-left left-0 ml-0">
                          Enter Folder Name:
                        </label>
                      </div>
                      <div className="mt-2 w-full">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          autoFocus={true}
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Ex. Photos"
                          required
                          className="w-full rounded-lg p-2 text-[17px] outline-none text-slate-950 dark:text-slate-100 bg-transparent border-2 border-slate-500 focus:border-blue-600 focus:border-opacity-70 duration-200"
                        />

                        {touched.name && (
                          <motion.p
                            initial={{ opacity: 0.5, y: "-3px" }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-slate-600 text-left text-sm mt-1"
                          >
                            {touched.name && errors.name}
                          </motion.p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={values.name ? false : true}
                        className={`${
                          values.name ? "cursor-pointer" : "cursor-not-allowed"
                        } w-32 rounded-xl bg-blue-600 hover:bg-blue-700 duration-300 p-3 text-sm font-semibold leading-6 text-white shadow-lg`}
                      >
                        {loader ? "Creating..." : "Create"}
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFolderButton;
