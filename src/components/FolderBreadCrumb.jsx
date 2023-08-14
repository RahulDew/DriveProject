import React from "react";
import { FcHome } from "react-icons/fc";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { Link } from "react-router-dom";

const FolderBreadCrumb = ({ currentFolder }) => {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  if (currentFolder) path = [...path, ...currentFolder.path];
  //   console.log("bhsi:", path);
  return (
    <div className="text-lg flex gap-2 items-center text-slate-100 bg-slate-700 hover:bg-slate-600  w-full h-10  p-2 font-semibold rounded-lg">
      <FcHome className="text-2xl" />
      {path.map((folder, index) => (
        <Link
          to={{
            pathname: folder.id ? `/folder/${folder.id}` : "/",
            state: { folder: { ...folder, path: path.slice(1, index) } },
          }}
          key={folder.id}
          className="truncate hover:underline cursor-pointer"
        >
          {folder.name} /
        </Link>
      ))}
      {currentFolder && (
        <div className="truncate text-slate-400 select-none">{currentFolder.name}</div>
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
