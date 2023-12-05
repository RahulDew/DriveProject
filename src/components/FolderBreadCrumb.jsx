import React, { useEffect, useRef } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { Link } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";

const FolderBreadCrumb = ({ currentFolder }) => {
  const containerRef = useRef(null);
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  if (currentFolder) path = [...path, ...currentFolder.path];

  useEffect(() => {
    const container = containerRef.current;
    // Scroll to the right on mount or whenever content changes
    container.scrollLeft = container.scrollWidth;

    // You can also add an event listener for dynamic updates
    // container.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    // return () => container.removeEventListener('scroll', handleScroll);
  }, [path.length]);

  // You can use the following function if you want to handle scroll events dynamically
  
  // const handleScroll = () => {
  //   // Your scroll handling logic here
  // const container = containerRef.current;
  // // You can adjust the scroll speed by changing the 'scrollBy' value
  // container.scrollBy({ left: 100, behavior: "smooth" });
  // };

  return (
    <div
      ref={containerRef}
      className="w-full scroll-smooth overflow-x-auto no-scrollbar p-2 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-100 flex justify-start items-center rounded-xl text-base lg:text-[17px] shadow-md duration-200 font-semibold"
    >
      {path.map((folder, index) => (
        <div key={folder.id} className="flex gap-1 justify-center items-center">
          <Link
            to={{
              pathname: folder.id ? `/folder/${folder.id}` : "/",
              state: { folder: { ...folder, path: path.slice(1, index) } },
            }}
            className="truncate cursor-pointer py-1 px-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg break-all duration-200"
          >
            {folder.name.length > 10
              ? `${folder.name.substring(0, 9)}...`
              : folder.name.toString()}
          </Link>
          <p className="text-xl mt-0.5">
            <MdOutlineNavigateNext />
          </p>
        </div>
      ))}
      {currentFolder ? (
        <div className="text-blue-600 select-none flex gap-1 justify-center items-center p-1 px-1.5 rounded-md">
          {/* {currentFolder.id === null && <HiOutlineHome className="text-lg" />} */}
          {currentFolder.name}
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
