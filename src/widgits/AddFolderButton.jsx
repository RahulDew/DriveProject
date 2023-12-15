import React, { useState } from "react";
import { database } from "../config/firebase";
import { addDoc } from "firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { motion } from "framer-motion";

import { Formik } from "formik";
import * as yup from "yup";

import { TbFolderPlus } from "react-icons/tb";
import { FcOpenedFolder } from "react-icons/fc";
import PopupWrapper from "../components/PopupWrapper";

// creating schema using yup library for validation
const newFolderSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter valid folder name")
    .max(25, "Folder name not greater then 25 characters!")
    .min(3, "Folder name should have atleast 3 characters!")
    .trim()
    .nonNullable(),
});

// initial values for folder
const initialFolderValues = {
  name: "",
};

const AddFolderButton = ({ currentFolder, button }) => {
  const [isFoldermodelOpen, setIsFolderModelOpen] = useState(false);
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
      // console.log(error);
      alert("Failed to create folder!");
      handleShowToast(`Failed to create folder!`, "failure");
    }
    onSubmitProps.resetForm();
    setLoader(false);
    setIsFolderModelOpen(false);
  };

  const handleCloseFolderModel = () => {
    setIsFolderModelOpen(false);
  };

  // const folderKeyDownHandler = (e) => {
  //   if (e.key === "Enter" && e.ctrlKey) setIsFolderModelOpen(true);
  // };

  // window.addEventListener("keydown", folderKeyDownHandler);

  return (
    <>
      {button ? (
        <button
          onClick={() => setIsFolderModelOpen(true)}
          className={`cursor-pointer text-2xl p-2 
          bg-blue-600 text-white hover:bg-blue-700 
        flex justify-center items-center gap-1 rounded-xl shadow-md duration-300 font-semibold`}
        >
          <TbFolderPlus />

          <div className="hidden md:block text-lg b-2">Folder</div>
        </button>
      ) : (
        <>
          <FcOpenedFolder className="text-6xl sm:text-8xl cursor-pointer opacity-60 dark:opacity-50 " />
          <div
            onClick={() => setIsFolderModelOpen(true)}
            className="p-2 px-4 flex justify-center items-center gap-2 cursor-pointer rounded-xl bg-transparent dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 text-amber-500 dark:text-amber-400 md:dark:hover:text-amber-500 duration-200"
          >
            <TbFolderPlus className="text-3xl cursor-pointer" />
            <span className="text-sm sm:text-lg font-semibold">
              Create Folder
            </span>
          </div>
        </>
      )}

      {/* Add Folder or File Model */}
      {isFoldermodelOpen && (
        <PopupWrapper handleWrapperClose={handleCloseFolderModel}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full relative transform overflow-hidden mx-5 sm:mx-auto rounded-2xl bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            {/* main content */}
            <div className="p-6">
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

                      <motion.p
                        initial={{ opacity: 0.5, y: "-3px" }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-slate-600 text-left text-sm mt-1"
                      >
                        {touched.name && errors.name}
                      </motion.p>
                    </div>

                    <button
                      type="submit"
                      disabled={values.name ? false : true}
                      className={`${
                        values.name ? "cursor-pointer" : "cursor-not-allowed"
                      } w-32 rounded-xl bg-blue-600 hover:bg-blue-700 duration-300 p-3 text-sm font-semibold leading-6 text-white shadow-lg`}
                    >
                      {loader ? (
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
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center gap-1.5">
                          <TbFolderPlus className="text-2xl" />
                          <span className="text-base">Create</span>
                        </div>
                      )}
                    </button>
                  </form>
                )}
              </Formik>
            </div>
          </motion.div>
        </PopupWrapper>
      )}
    </>
  );
};

export default AddFolderButton;
