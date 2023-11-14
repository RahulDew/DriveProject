import React, { useState } from "react";
import { FcFolder } from "react-icons/fc";
import { Link } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import { useFolder } from "../hooks/useFolder";
import { motion } from "framer-motion";
import { useAuthContext } from "../context/AuthContext";
import { BiDotsVerticalRounded } from "react-icons/bi";

const Folder = ({ folder }) => {
  const [folderModal, setFolderModal] = useState(null);
  // // console.log(folder.id);
  const { childFolders, childFiles } = useFolder(folder.id);

  const { handleShowToast } = useAuthContext();

  const handleShowFolderInfo = () => {
    // console.log(childFolders);
    // console.log(childFiles);
    if (
      (Array.isArray(childFolders) && childFolders.length) ||
      (Array.isArray(childFiles) && childFiles.length)
    ) {
      // console.log(
      //   `This Folder contains ${childFolders.length} Sub Folders and  ${childFiles.length} Files so yo have to delete those first`
      // );
      // console.log(folder);
      setFolderModal({
        deletable: false,
        childFolders: childFolders.length && childFolders.length,
        childFiles: childFiles.length && childFiles.length,
      });
    } else {
      setFolderModal({
        deletable: true,
        // name: folder.name,
        // createdAt: folder.createdAt,
      });
    }
  };

  const handleDeleteFolder = async (folderId) => {
    console.log("deleting the folder...");
    const FolderRef = doc(database.folders, folder.id);
    await deleteDoc(FolderRef);
    console.log("Folder is deleted...");
    handleShowToast(`Folder '${folder.name}' deleted!`, "failure");
    setFolderModal(null);
  };

  return (
    <>
      <div className="w-32 md:w-36 lg:w-48 flex flex-col gap-1 justify-center items-center text-sm sm:text-base p-2 px-3 sm:px-5 rounded-xl lg:rounded-2xl bg-slate-50 dark:bg-slate-900 focus:bg-opacity-40 md:hover:bg-opacity-40 md:dark:hover:bg-slate-800 dark:shadow-none shadow-2xl focus:shadow-blue-300 md:hover:shadow-blue-300 duration-200 cursor-pointer ">
        <Link to={folder.id ? `/folder/${folder.id}` : "/"}>
          <FcFolder className="text-7xl md:text-7xl lg:text-8xl opacity-80" />
        </Link>
        <div className="w-full flex gap-1 justify-between items-center">
          <div className="truncate">{folder.name}</div>
          <div
            onClick={() => handleShowFolderInfo(folder.id)}
            className="p-0.5 sm:p-1 text-sm sm:text-base md:text-xl bg-slate-200 lg:hover:bg-slate-300 dark:bg-slate-700 lg:dark:hover:bg-slate-600 duration-200 shadow-md rounded-md"
          >
            <BiDotsVerticalRounded />
          </div>
        </div>
      </div>

      {folderModal && (
        <div className="fixed inset-0 z-40 overflow-y-auto ">
          <div
            onClick={() => setFolderModal(null)}
            className={
              "fixed inset-0 bg-gray-800 opacity-70 dark:bg-slate-950 dark:opacity-80 transition-opacity"
            }
          ></div>
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              {/* main content */}
              <div className="p-8 sm:px-20 flex justify-center items-center flex-col gap-5">
                {/* Folder Name */}
                <p className="flex gap-2 flex-wrap justify-center items-center text-xl text-center font-semibold ">
                  <FcFolder className="text-4xl opacity-80" />
                  <span className="text-2xl text-blue-600 font-semibold break-all ">
                    {folder.name}
                  </span>
                </p>
                {/* Folder created date */}
                <p className="text-center text-lg text-slate-700 dark:text-slate-300">
                  Folder created - {folder.createdAt.toDate().toDateString()}
                </p>

                {folderModal.deletable ? (
                  <div className="text-center space-y-3">
                    <p>Want to delete this folder ?</p>
                    <button
                      type="button"
                      onClick={handleDeleteFolder}
                      className="w-32 mt-2 rounded-xl bg-red-600 hover:bg-red-700 duration-300 p-3 text-md font-semibold leading-6 text-white shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <>
                    {/* childItmes warning */}
                    <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-10 font-semibold text-slate-700 dark:text-slate-300 text-xl">
                      {folderModal.childFolders > 0 && (
                        <div className="flex gap-2 items-center">
                          <p>Child Folders </p>
                          <span className="h-7 px-2 bg-blue-600 opacity-80 rounded-md text-center text-white">
                            {folderModal.childFolders}
                          </span>
                        </div>
                      )}
                      {folderModal.childFiles > 0 && (
                        <div className="flex gap-2 items-center">
                          <p>Child Files </p>
                          <span className="h-7 px-2 bg-blue-600 opacity-80 rounded-md text-center text-white">
                            {folderModal.childFiles}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-center text-slate-700 dark:text-slate-300 font-thin">
                      To delete this folder You have to delete all child folders
                      and child files of this folder!
                    </p>
                  </>
                )}
              </div>

              {/* confirmation */}
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default Folder;
