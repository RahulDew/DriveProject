import React from "react";
import { FcFolder } from "react-icons/fc";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { doc, deleteDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import { useFolder } from "../hooks/useFolder";
import { getDocs } from "firebase/firestore";

const Folder = ({ folder }) => {
  // // console.log(folder.id);
  const { childFolders, childFiles } = useFolder(folder.id);
  // console.log(`childFolders of this folder: ${JSON.stringify(childFolders)}`);
  // // console.log(`childFiles of this folder: ${childFiles J}`);

  const handleDeleteFolder = async (folderId) => {
    // console.log(childFolders);
    // console.log(childFiles);
    if (
      (Array.isArray(childFolders) && childFolders.length) ||
      (Array.isArray(childFiles) && childFiles.length)
    ) {
      console.log("this folder contains subfolders and files!");
      alert(
        `This Folder contains ${childFolders.length} Sub Folders and  ${childFiles.length} Files so yo have to delete those first`
      );
    } else {
      console.log("Folder is Empty!");
      console.log("deleting the folder...");
      const FolderRef = doc(database.folders, folder.id);
      await deleteDoc(FolderRef);
      console.log("Folder is deleted...");
    }
  };

  return (
    <div className="w-52 flex flex-col gap-1 justify-center items-center text-base p-2 rounded-md bg-slate-800 hover:bg-slate-700  duration-200 cursor-pointer ">
      <Link to={folder.id ? `/folder/${folder.id}` : "/"}>
        <FcFolder className="text-8xl opacity-70" />
      </Link>
      <div className="flex gap-3 justify-between items-center">
        <div className="truncate">{folder.name}</div>
        <div
          onClick={() => handleDeleteFolder(folder.id)}
          className="text-xl p-1 bg-slate-700 hover:bg-slate-500 duration-300 rounded-full"
        >
          <MdDelete />
        </div>
      </div>
      {/* <div>{folder.id}</div> */}
    </div>
  );
};

export default Folder;
