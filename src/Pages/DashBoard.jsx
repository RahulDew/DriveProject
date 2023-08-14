import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useFolder } from "../hooks/useFolder";
import Navbar from "../components/Navbar";
import AddFolderButton from "../widgits/AddFolderButton";
import AddFileButton from "../widgits/addFileButton";

import { AiFillFolderAdd, AiFillFileAdd } from "react-icons/ai";
// import { FcHome } from "react-icons/fc";
import Folder from "../components/Folder";
import File from "../components/File";
import FolderBreadCrumb from "../components/FolderBreadCrumb";

const DashBoard = () => {
  const Navigate = useNavigate();
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { logOut } = useAuthContext();

  // console.log(state);
  const { folder, childFolders, childFiles } = useFolder(folderId);
  // console.log("Parent Folder: ", folder);
  // console.log("Child Folders: ", childFolders);
  console.log("Child Files: ", childFiles);

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("LoggedOut");
      Navigate("login", { replace: true });
    } catch (error) {
      console.log("Can't get logged out");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 lg:px-8">
      <Navbar handleLogout={handleLogout} />

      {/* Yahan se start h  */}
      <div className="flex justify-between items-center gap-2 mx-auto my-10">
        <FolderBreadCrumb currentFolder={folder} />
        <div className="flex flex-row gap-3">
          {/* <AddItemButton icon={<AiFillFileAdd />} type={"File"} /> */}
          <AddFileButton icon={<AiFillFileAdd />} currentFolder={folder} />
          <AddFolderButton icon={<AiFillFolderAdd />} currentFolder={folder} />
        </div>
      </div>
      {/* parent folders */}
      {/* {folder && <Folder folder={folder} />} */}

    
      {/* Child Folders */}
      {childFolders && (
        <div className="px-5 bg-opacity-10 flex flex-row flex-wrap justify-start items-center gap-5 ">
          {childFolders.map((childFolder) => (
            <div key={childFolder.id} className="">
              <Folder folder={childFolder} />
            </div>
          ))}
        </div>
      )}

      <hr className="font-bold border-slate-600 my-5" />

      {/* Child Folders */}
      {childFiles && (
        <div className="px-5 bg-opacity-10 flex flex-row flex-wrap justify-start items-center gap-5 ">
          {childFiles.map((childFolder) => (
            <div key={childFolder.id}>
              <File file={childFolder} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashBoard;
