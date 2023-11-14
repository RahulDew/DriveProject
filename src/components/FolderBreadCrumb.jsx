import React from "react";
import { HiOutlineHome } from "react-icons/hi";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { Link } from "react-router-dom";

const FolderBreadCrumb = ({ currentFolder }) => {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  if (currentFolder) path = [...path, ...currentFolder.path];
  // console.log(path);
  // console.log(currentFolder);
  // console.log(currentFolder?.id);
  // console.log(path.slice(1, path.length-1));
  return (
    <div className="w-full overflow-x-auto p-2.5 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-100 flex justify-start items-center gap-2 rounded-xl text-lg shadow-md duration-300 font-semibold">
      <HiOutlineHome className="text-2xl" />
      {/* {!currentFolder?.id === null && (
        <Link to={"/"} className="hover:underline cursor-pointer break-all">
          Home /
        </Link>
      )} */}

      {path.map((folder, index) => (
        <div key={folder.id} className="flex gap-1">
          <Link
            to={{
              pathname: folder.id ? `/folder/${folder.id}` : "/",
              state: { folder: { ...folder, path: path.slice(1, index) } },
            }}
            className="truncate hover:underline cursor-pointer break-all"
          >
            {folder.name.length > 10
              ? `${folder.name.substring(0, 14)}...`
              : folder.name.toString()}
          </Link>
          <p>/</p>
        </div>
      ))}
      {/* / */}
      {currentFolder ? (
        <div className="text-blue-600 select-none">
          {/* {currentFolder.name} */}
          {currentFolder.name.length > 10
            ? `${currentFolder.name.substring(0, 10)}...`
            : currentFolder.name.toString()}
        </div>
      ) : (
        <div className="sm:truncate text-blue-600 select-none">...</div>
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
