import React from "react";
import { FcFolder } from "react-icons/fc";
import { Link } from "react-router-dom";

const Folder = ({ folder }) => {
  return (
    <Link
      to={folder.id ? `/folder/${folder.id}` : "/"}
      className="w-52 flex flex-col gap-1 justify-center items-center text-base p-2 rounded-md bg-slate-800 hover:bg-slate-700  duration-200 cursor-pointer "
    >
      <FcFolder className="text-8xl opacity-70" />
      <div className="truncate">{folder.name}</div>
    </Link>
  );
};

export default Folder;
