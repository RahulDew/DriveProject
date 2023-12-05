import { useState } from "react";

import { useAuthContext } from "../context/AuthContext";

import FileSearch from "../components/FileSearch";
import FolderSearch from "../components/FolderSearch";
import { pageTitle } from "../utils";

const SearchIntro = ({ isFileSearch, setIsFileSearch }) => {
  return (
    <>
      <div className="w-40 sm:w-48 flex gap-1.5 items-center justify-between bg-slate-50 dark:bg-slate-900 shadow-xl hover:shadow-blue-200 dark:shadow-none rounded-full p-1.5 sm:p-2 text-sm md:text-[17px] font-semibold duration-300">
        {/* {isFileSearchs.map((itemType, index) => (
          <div
            key={index}
            onClick={() => setIsFileSearch(itemType.value)}
            className={`${
              isFileSearch == itemType.value
                ? "bg-blue-600 text-white cursor-default"
                : "bg-slate-200 hover:bg-blue-100 dark:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-600 dark:hover:bg-blue-950 cursor-pointer "
            } w-24 md:p-2.5 p-3 rounded-full duration-300`}
          >
            {itemType.text}
          </div>
        ))} */}

        <div
          onClick={() => setIsFileSearch(true)}
          className={`${
            isFileSearch
              ? "bg-blue-600 text-white cursor-default"
              : "bg-slate-200 hover:bg-blue-100 dark:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-600 dark:hover:bg-blue-950 cursor-pointer "
          } w-1/2 p-2 md:p-2.5 rounded-full duration-300`}
        >
          Files
        </div>

        <div
          onClick={() => setIsFileSearch(false)}
          className={`${
            !isFileSearch
              ? "bg-blue-600 text-white cursor-default"
              : "bg-slate-200 hover:bg-blue-100 dark:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-600 dark:hover:bg-blue-950 cursor-pointer "
          } w-1/2 p-2 md:p-2.5  rounded-full duration-300`}
        >
          Folders
        </div>
      </div>

      <h3 className="text-2xl sm:text-4xl font-bold">
        Want to find {isFileSearch ? "Files" : "Folders"} or lost their
        location?
      </h3>
      <p className="text-lg sm:text-xl font-light text-slate-500">
        Lets find your {isFileSearch ? "Files" : "Folders"}, type the name of
        your {isFileSearch ? "Files" : "Folders"}
      </p>
    </>
  );
};

const Search = () => {
  const [isFileSearch, setIsFileSearch] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  const { currentUser } = useAuthContext();

  pageTitle("Search | Stasher");

  return (
    <div
      className={`sm:px-5 mt-5 h-full w-full flex flex-col justify-center items-center gap-5`}
    >
      {/* Search intro component */}

      <SearchIntro
        isFileSearch={isFileSearch}
        setIsFileSearch={setIsFileSearch}
      />

      {isFileSearch ? (
        // search for files
        <FileSearch
          contentLoading={contentLoading}
          setContentLoading={setContentLoading}
          currentUser={currentUser}
        />
      ) : (
        // search for folders
        <FolderSearch
          contentLoading={contentLoading}
          setContentLoading={setContentLoading}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Search;
