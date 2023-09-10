import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useFolder } from "../hooks/useFolder";
import Navbar from "../components/Navbar";
import AddFolderButton from "../widgits/AddFolderButton";
// import AddFileButton from "../widgits/addFileButton";
import AddFileButton from "../widgits/AddFileButton";

import { AiFillFolderAdd, AiFillFileAdd } from "react-icons/ai";
// import { FcHome } from "react-icons/fc";
import Folder from "../components/Folder";
import File from "../components/File";
import FolderBreadCrumb from "../components/FolderBreadCrumb";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { FcOpenedFolder, FcFile } from "react-icons/fc";

const DashBoard = () => {
  // const Navigate = useNavigate();
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  // const { logOut } = useAuthContext();
  // const [folderLoading, setFolderLoading] = useState(true);

  // console.log(state);
  const { folder, childFolders, childFiles } = useFolder(folderId);
  // console.log("Parent Folder: ", folder);
  // console.log("Child Folders: ", childFolders);
  // console.log("Child Files: ", childFiles);

  return (
    <div className="w-full min-h-screen">
      <div className="ml-20 text-center bg-[#E2EFFF] min-h-screen p-6 lg:px-8">
        <Navbar />
        {/* Yahan se start h  */}
        <div className="flex justify-between items-center gap-2 mx-auto my-10">
          <FolderBreadCrumb currentFolder={folder} />
          <div className="flex flex-row gap-3">
            {/* <AddItemButton icon={<AiFillFileAdd />} type={"File"} /> */}
            <AddFileButton icon={<AiFillFileAdd />} currentFolder={folder} />
            <AddFolderButton
              icon={<AiFillFolderAdd />}
              currentFolder={folder}
            />
          </div>
        </div>
        {/* parent folders */}
        <div className="mb-4 pb-2 px-5 text-xl rounded-xl font-semibold  text-slate-700 left-0 text-left  ">
          Folders of {folder && folder.name} :
        </div>

        {/* Child Folders */}
        {Array.isArray(childFolders) && childFolders.length ? (
          <div className="px-5 bg-opacity-10 flex flex-row flex-wrap justify-center items-center gap-8 ">
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
                <FcOpenedFolder className="text-8xl opacity-50" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            )}
          </>
        )}
        {/* <Loader/> */}
        <hr className="font-bold border-slate-300 my-4" />

        <div className="mb-4 pb-2 px-5 text-xl rounded-xl font-semibold  text-slate-700 left-0 text-left  ">
          Files of {folder && folder.name} :
        </div>
        {/* Child Folders */}
        {Array.isArray(childFiles) && childFiles.length ? (
          <div className=" px-1 sm:px-5 bg-opacity-10 flex flex-row flex-wrap justify-center items-center gap-5 ">
            {childFiles
              .map((childFolder) => (
                <motion.div
                  layout
                  // transition={{ delay: 3 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  // transition={{ duration: 0.2 }}
                  key={childFolder.id}
                >
                  <File file={childFolder} currentFolder={folder} />
                </motion.div>
              ))
              .reverse()}
          </div>
        ) : (
          <>
            {Array.isArray(childFiles) ? (
              <div className="flex flex-col justify-center items-center">
                <FcFile className="text-8xl opacity-50" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
