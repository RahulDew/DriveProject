import React, { useState } from "react";
import { FcFolder } from "react-icons/fc";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { doc, deleteDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import { useFolder } from "../hooks/useFolder";
import { motion } from "framer-motion";
import { useAuthContext } from "../context/AuthContext";
import { BiDotsVerticalRounded } from "react-icons/bi";

const Folder = ({ folder }) => {
  const [deleteWarn, setDeleteWarn] = useState(null);
  // // console.log(folder.id);
  const { childFolders, childFiles } = useFolder(folder.id);

  const { handleShowToast } = useAuthContext();

  const handleCheckFolderState = () => {
    // console.log(childFolders);
    // console.log(childFiles);
    if (
      (Array.isArray(childFolders) && childFolders.length) ||
      (Array.isArray(childFiles) && childFiles.length)
    ) {
      console.log(
        `This Folder contains ${childFolders.length} Sub Folders and  ${childFiles.length} Files so yo have to delete those first`
      );
      console.log(folder);
      setDeleteWarn({
        type: "not deletable",
        childFolders: childFolders.length && childFolders.length,
        childFiles: childFiles.length && childFiles.length,
      });
    } else {
      setDeleteWarn({
        type: "deletable",
        name: folder.name,
        createdAt: folder.createdAt,
      });
    }
  };

  const handleDeleteFolder = async (folderId) => {
    console.log("deleting the folder...");
    const FolderRef = doc(database.folders, folder.id);
    await deleteDoc(FolderRef);
    console.log("Folder is deleted...");
    handleShowToast(`Folder '${folder.name}' deleted!`, "failure");
  };

  return (
    <>
      <div className="w-32 md:w-36 lg:w-48 flex flex-col gap-1 justify-center items-center text-sm sm:text-base p-2 px-5 rounded-xl lg:rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-opacity-40 shadow-2xl hover:shadow-blue-300 dark:shadow-none dark:hover:bg-slate-800 duration-200 cursor-pointer ">
        <Link to={folder.id ? `/folder/${folder.id}` : "/"}>
          <FcFolder className="text-7xl md:text-7xl lg:text-8xl opacity-80" />
        </Link>
        <div className="w-full flex gap-1 justify-center items-center">
          <div className="truncate">{folder.name}</div>
          <div
            onClick={() => handleCheckFolderState(folder.id)}
            className="p-1 text-sm sm:text-lg md:text-xl right-0  hover:text-blue-500 duration-200 shadow-md  rounded-md"
          >
            <BiDotsVerticalRounded />
          </div>
        </div>
      </div>

      {deleteWarn && (
        <div className="fixed inset-0 z-40 overflow-y-auto ">
          <div
            onClick={() => setDeleteWarn(null)}
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
              <div className="p-8 px-20 flex justify-center items-center flex-col gap-5">
                {deleteWarn.type == "not deletable" ? (
                  <>
                    {/* childitmes warning */}
                    <p className="text-2xl text-blue-600 font-semibold">
                      Folder is not Empty...!!!
                    </p>
                    <div className="w-full flex justify-center items-center gap-10 font-bold text-slate-500 text-xl">
                      {deleteWarn.childFolders > 0 && (
                        <div className="flex gap-2">
                          <p>Child Folders </p>
                          <span className="bg-blue-600 opacity-80 w-7 h-7 rounded-lg text-center text-white">
                            {deleteWarn.childFolders}
                          </span>
                        </div>
                      )}
                      {deleteWarn.childFiles > 0 && (
                        <div className="flex gap-2">
                          <p>Child Files </p>
                          <span className="bg-blue-600 opacity-80 w-7 h-7 rounded-lg text-center text-white">
                            {deleteWarn.childFiles}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xl  text-center font-thin">
                      You have to delete all folders and files of this folder!!!
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xl text-center font-semibold text-slate-500 dark:text-slate-300">
                      Folder Name:
                      <span className="block text-blue-600 font-semibold break-words">
                        {deleteWarn.name}
                      </span>
                    </p>
                    <p className="text-center text-lg text-slate-500 dark:text-slate-300">
                      Folder created -
                      {deleteWarn.createdAt.toDate().toDateString()}
                    </p>
                    <div className="text-center space-y-2">
                      <p>Want to delete this folder ?</p>
                      <button
                        type="button"
                        onClick={handleDeleteFolder}
                        className="w-32 rounded-xl bg-red-600 hover:bg-red-700 duration-300 p-3 text-md font-semibold leading-6 text-white shadow-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
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
