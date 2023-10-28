import React from "react";
import { HiOutlineHome } from "react-icons/hi";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { Link } from "react-router-dom";

const FolderBreadCrumb = ({ currentFolder }) => {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  if (currentFolder) path = [...path, ...currentFolder.path];
  //   console.log("bhai:", path);
  return (
    <div className="w-full p-2.5 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-100 flex justify-start items-center gap-2 rounded-xl text-lg shadow-md duration-300 font-semibold">
      <HiOutlineHome className="text-2xl" />
      {path.map((folder, index) => (
        <Link
          to={{
            pathname: folder.id ? `/folder/${folder.id}` : "/",
            state: { folder: { ...folder, path: path.slice(1, index) } },
          }}
          key={folder.id}
          className="sm:truncate hover:underline cursor-pointer"
        >
          {folder.name} /
        </Link>
      ))}
      {currentFolder ? (
        <div className="sm:truncate text-blue-600 select-none">
          {currentFolder.name}
        </div>
      ) : (
        <div className="sm:truncate text-blue-600 select-none">
          ...
        </div>
      )}
    </div>
  );
};

export default FolderBreadCrumb;

// to={{
//     pathname: `folder/${folder.id}`,
//     search: "?sort=name",
//     hash: "#the-hash",
//     state: { fromDashboard: true }
//   }}
