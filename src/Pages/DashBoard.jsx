import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useFolder } from "../hooks/useFolder";
import AddFolderButton from "../widgits/AddFolderButton";
import AddFileButton from "../widgits/AddFileButton";

import Folder from "../components/Folder";
import File from "../components/File";
import FolderBreadCrumb from "../components/FolderBreadCrumb";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { FcOpenedFolder, FcFile } from "react-icons/fc";
import { pageTitle } from "../utils";
import Tooltip from "../widgits/Tooltip";

const DashBoard = () => {
  pageTitle("Home | Stasher");

  const { folderId } = useParams();
  const { state = {} } = useLocation();

  // console.log(state);
  const { folder, childFolders, childFiles } = useFolder(folderId);
  // console.log("Parent Folder: ", folder);
  // console.log("Child Folders: ", childFolders);
  // console.log("Child Files: ", childFiles);

  return (
    <>
      {/* file manager nav */}
      <div className="flex justify-between w-full flex-col sm:flex-row items-center gap-4 sm:gap-2 mx-auto my-8">
        <FolderBreadCrumb currentFolder={folder} />
        <div className="w-full sm:w-28 md:w-44 flex flex-row justify-between sm:justify-center items-center ">
          <h4 className="sm:hidden text-lg pl-2 font-semibold text-slate-500 truncate">
            Always Ready for upload...
          </h4>
          <div className="flex items-center gap-2">
            <AddFileButton currentFolder={folder} button />
            <AddFolderButton currentFolder={folder} button />
          </div>
        </div>
      </div>

      {/* parent folder name */}
      <div className="mb-4 pb-2 px-2 sm:px-5 text-xl rounded-xl font-semibold  text-slate-700 dark:text-slate-300 left-0 text-left break-all ">
        Folders of {folder ? folder.name : "..."}
      </div>

      {/* Child Folders */}
      {Array.isArray(childFolders) && childFolders.length ? (
        <div className="px-1 sm:px-5 flex flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 ">
          {childFolders
            .map((childFolder) => (
              <motion.div layout key={childFolder.id}>
                <Folder folder={childFolder} />
              </motion.div>
            ))
            .reverse()}
        </div>
      ) : (
        <>
          {Array.isArray(childFolders) ? (
            <div className="flex flex-col justify-center items-center">
              <AddFolderButton currentFolder={folder} />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          )}
        </>
      )}

      {/* line break */}
      <hr className="font-bold border-slate-300 dark:border-slate-700 my-4 duration-200" />

      <div className="mb-4 pb-2 px-2 sm:px-5 text-xl rounded-xl font-semibold  text-slate-700 dark:text-slate-300 left-0 text-left break-all">
        Files of {folder ? folder.name : "..."}
      </div>

      {/* Child Files */}
      {Array.isArray(childFiles) && childFiles.length ? (
        <div className=" px-1 sm:px-5 bg-opacity-10 flex flex-row flex-wrap justify-center items-center gap-4 sm:gap-8">
          {childFiles
            .map((childFile) => (
              <motion.div
                layout
                // transition={{ delay: 3 }}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                // transition={{ duration: 0.2 }}
                key={childFile.id}
              >
                <File file={childFile} currentFolder={folder} />
              </motion.div>
            ))
            .reverse()}
        </div>
      ) : (
        <>
          {Array.isArray(childFiles) ? (
            <div className="flex flex-col justify-center items-center">
              {/* <FcFile className="text-8xl opacity-50" /> */}
              <AddFileButton currentFolder={folder} />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DashBoard;
