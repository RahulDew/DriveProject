import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase";
import { useAuthContext } from "../context/AuthContext";

import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";

import { FcFile } from "react-icons/fc";
import { MdDeleteOutline } from "react-icons/md";
import { PiShareFat } from "react-icons/pi";
import { BsCheck2Circle } from "react-icons/bs";

import { HiOutlineDownload } from "react-icons/hi";
import { Link } from "react-router-dom";

import VideoPlayer from "../widgits/VideoPlayer";
import AudioPlayer from "../widgits/AudioPlayer";
import DocViewer from "../widgits/DocViewer";
import PopupWrapper from "./PopupWrapper";
import { ICONS_DICTIONARY } from "../constants/constants";


const File = ({ file, currentFolder }) => {
  const [fileModel, setFileModel] = useState(null);
  const [copiedLink, setCopiedLink] = useState("");
  const { currentUser, handleShowToast } = useAuthContext();

  //handeling the delete functionality
  const handleDelete = async (fileId, filePath) => {
    //deleting the file from FireStore Database
    const fileRef = doc(db, "files", fileId);
    await deleteDoc(fileRef);

    //deleting the file from Firebase Storage
    const storageFileref = ref(
      storage,
      `/files/${currentUser.uid}/${filePath}`
    );
    // console.log(storageFileref);
    await deleteObject(storageFileref);
    // console.log("ho gye file delete storage se...");
    handleShowToast("1 file deleted", "failure");
  };

  const handleCopyShareLink = (url) => {
    setCopiedLink(file.url);
    navigator.clipboard.writeText(file.url);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDownload = () => {
    // handleShowToast("bingo", "warning");
  };

  const handleCloseFileModel = () => {
    setFileModel(null);
  };

  let fileIcon = <FcFile />;

  ICONS_DICTIONARY.map((item, index) => {
    if (file.type.startsWith(item.type)) {
      return (fileIcon = item.icon);
    }
  });

  return (
    <>
      <div className="flex flex-col gap-2 text-base p-2 pt-2.5 sm:p-2 sm:pt-3 md:p-4 rounded-xl lg:rounded-2xl bg-slate-50 dark:bg-slate-900 focus:bg-opacity-40 md:hover:bg-opacity-40 md:dark:hover:bg-slate-800 dark:shadow-none shadow-2xl focus:shadow-blue-300 md:hover:shadow-blue-300 cursor-pointer duration-200 ">
        {/* file preview */}
        <div
          onClick={() => setFileModel(file)}
          className="m-auto w-32 h-32 sm:w-32 sm:h-36 md:w-40 md:h-40 lg:w-52 lg:h-52 flex justify-center items-center"
        >
          {file.type.startsWith("image") ? (
            // <div className="w-48 h-56 flex justify-center items-center">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              src={file.url}
              alt={file.name}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-6xl md:text-8xl lg:text-9xl flex justify-center items-center">
              {fileIcon}
            </div>
          )}
        </div>

        <div className="flex gap-[2px] sm:gap-0.5 lg:gap-2 items-center justify-between">
          <div className="flex justify-start items-center gap-1">
            {/* file icon */}
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
              {fileIcon}
            </div>
            {/* file name for desktop screen */}
            <div className="hidden sm:block text-xs sm:text-[12px] md:text-[14px] lg:text-base truncate duration-200">
              {file.name.length > 14
                ? `${file.name.substr(0, 14)}...`
                : file.name.toString()}
            </div>
            {/* file name for mobile screen */}
            <div className="block sm:hidden text-xs sm:text-[12px] md:text-[14px] lg:text-base truncate duration-200">
              {file.name.length > 11
                ? `${file.name.substr(0, 11)}...`
                : file.name.toString()}
            </div>
          </div>
          <Link
            to={file.url}
            target="_blank"
            className="p-0.5 md:p-1 text-sm sm:text-base md:text-xl bg-slate-200 lg:hover:bg-slate-300 dark:bg-slate-700 lg:dark:hover:bg-slate-600 duration-200 shadow-md rounded-md"
          >
            <HiOutlineDownload />
          </Link>
        </div>
      </div>

      {/* File viewer */}
      {fileModel && (
        <PopupWrapper handleWrapperClose={handleCloseFileModel}>
          <motion.div
            // whileHover={{ opacity: 0.8 }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-full sm:rounded-2xl bg-slate-50 dark:bg-slate-900 text-left shadow-xl transition-all my-0 sm:w-full sm:max-w-3xl"
          >
            <div className="w-full flex flex-col p-5 justify-center items-center text-[17px]">
              {/* <p>{fileModel.name.substring(fileModel.name.lastIndexOf('.') + 1)}</p> */}
              {/* file Preview */}
              <div className="w-full md:w-11/12 h-[25rem] sm:h-[30rem] flex justify-center items-center border-2 border-slate-300 dark:border-slate-700 rounded-2xl">
                {fileModel.type.startsWith("image/") && (
                  <img
                    src={fileModel.url}
                    alt={fileModel.name}
                    className="object-contain h-full w-full rounded-xl"
                  />
                )}
                {fileModel.type.startsWith("video/") && (
                  <VideoPlayer src={fileModel.url} type={fileModel.type} />
                )}
                {fileModel.type.startsWith("audio/") && (
                  <AudioPlayer src={fileModel.url} type={fileModel.type} />
                )}
                {fileModel.type.startsWith("application/pdf") && (
                  <DocViewer src={fileModel.url} type={fileModel.type} />
                )}
                {fileModel.name.substring(
                  fileModel.name.lastIndexOf(".") + 1
                ) == "exe" && <FcFile className="text-[10rem]" />}
              </div>
              {/* file info and options */}
              <div className="w-full flex gap-2 mt-7 md:px-8 justify-between flex-col-reverse sm:flex-row">
                {/* file details */}
                <div className=" flex flex-col">
                  {/* file name */}
                  <article className="flex gap-3 justify-start  flex-col sm:flex-row p-1">
                    <span className="w-full sm:w-32 font-bold text-left text-slate-500 dark:text-slate-400">
                      File Name:
                    </span>
                    <p className="w-full font-semibold text-slate-700 dark:text-slate-100 ">
                      {fileModel.name}
                    </p>
                  </article>
                  {/* file createdAt */}
                  <article className="flex gap-3 justify-start items-center flex-col sm:flex-row p-1">
                    <span className="w-full sm:w-32 font-bold  text-slate-500 dark:text-slate-400">
                      Created Date:
                    </span>
                    <p className="w-full font-semibold text-slate-700 dark:text-slate-100">
                      {file.createdAt.toDate().toDateString()}
                    </p>
                  </article>
                  {/* file size */}
                  <article className="flex gap-3 justify-start items-center flex-col sm:flex-row  p-1">
                    <span className="w-full sm:w-32 font-bold  text-slate-500 dark:text-slate-400">
                      File Size:
                    </span>
                    <p className="w-full font-semibold text-slate-700 dark:text-slate-100">
                      {(fileModel.size / 3000000).toString().slice(0, 5)} MB
                    </p>
                  </article>
                  {/* file type */}
                  <article className="flex gap-3 justify-start items-center flex-col sm:flex-row p-1">
                    <span className="w-full sm:w-32 font-bold  text-slate-500 dark:text-slate-400">
                      File Type:
                    </span>
                    <p className="w-full font-semibold text-slate-700 dark:text-slate-100">
                      {fileModel.type}
                    </p>
                  </article>
                  {/* file path */}
                  <article className="flex gap-3 justify-start flex-col sm:flex-row p-1">
                    <span className="w-full sm:w-32 font-bold  text-slate-500 dark:text-slate-400">
                      File Path:
                    </span>
                    <p className="w-full font-semibold text-slate-700 dark:text-slate-100 ">
                      {fileModel.path}
                    </p>
                  </article>
                </div>
                {/* Buttons */}
                <div className="flex flex-row-reverse sm:flex-col justify-center gap-3">
                  {/* close Modal */}
                  <button
                    onClick={() => setFileModel(null)}
                    className="w-10 h-10 cursor-pointer flex justify-center items-center gap-2 text-black bg-slate-300 p-2 px-3 rounded-xl shadow-md duration-300"
                  >
                    {/* <span className="font-bold text-base">Close</span> */}
                    <div className="text-xl">
                      <MdClose />
                    </div>
                  </button>
                  {/* Share File Link*/}
                  <div className="group relative">
                    <button
                      onClick={handleCopyShareLink}
                      className="w-10 h-10 cursor-pointer flex justify-center items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 p-2 px-3 rounded-xl shadow-md duration-300"
                    >
                      <div className="text-xl duration-200 font-bold">
                        {copiedLink ? <BsCheck2Circle /> : <PiShareFat />}
                      </div>
                    </button>
                    {copiedLink && (
                      <motion.span
                        layout
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center text-sm text-white bg-blue-600 font-semibold p-2 rounded-xl pointer-events-none absolute top-12 -left-3 sm:-left-20 sm:right-11 sm:-top-2 "
                      >
                        Link Copied!
                      </motion.span>
                    )}
                  </div>

                  {/* file delete */}
                  <button
                    onClick={() => handleDelete(fileModel.id, fileModel.path)}
                    className="w-10 h-10 cursor-pointer flex justify-center items-center gap-2 text-white bg-rose-600 hover:bg-rose-700 p-2 rounded-xl shadow-md duration-300"
                  >
                    {/* <span className="font-semibold text-sm">Delete</span> */}
                    <div className="text-xl">
                      <MdDeleteOutline />
                    </div>
                  </button>
                </div>
              </div>
              {/* {JSON.stringify(fileModel)} */}
            </div>
          </motion.div>
        </PopupWrapper>
      )}
    </>
  );
};

export default File;
