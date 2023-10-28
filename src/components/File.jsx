import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { database, db } from "../config/firebase";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { useAuthContext } from "../context/AuthContext";

import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import downloadFile from "../utils";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";

import {
  FcImageFile,
  FcVlc,
  FcSpeaker,
  FcDocument,
  FcClapperboard,
  FcQuestions,
  FcGallery,
  FcContacts,
  FcMusic,
  FcTemplate,
  FcRules,
  FcAnswers,
  FcFile,
} from "react-icons/fc";
import { MdDelete, MdDownload } from "react-icons/md";
import { HiOutlineDownload } from "react-icons/hi";
import { Link } from "react-router-dom";

import VideoPlayer from "../widgits/VideoPlayer";
import AudioPlayer from "../widgits/AudioPlayer";
import DocViewer from "../widgits/DocViewer";

const iconDictionary = [
  {
    type: "image",
    icon: <FcGallery />,
    preview: "image",
  },
  {
    type: "video",
    icon: <FcClapperboard />,
    preview: "video",
  },
  {
    type: "audio",
    icon: <FcMusic />,
    preview: "song",
  },
  {
    type: "application",
    icon: <FcDocument />,
    preview: "docments",
  },
  {
    type: "text",
    icon: <FcRules />,
    preview: "text/html",
  },
  {
    type: "file/data",
    icon: <FcContacts />,
    preview: "text/html",
  },
];

const File = ({ file, currentFolder }) => {
  const [fileModel, setFileModel] = useState(null);
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
    console.log("ho gye file delete storage se...");
    handleShowToast("1 file deleted", "failure");
  };

  const handleDownload = () => {
    handleShowToast("1 file deleted", "failure");
    // fetch(file.url, { mode: "no-cors" })
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     const blobUrl = window.URL.createObjectURL(new Blob([blob]));
    //     const aTag = document.createElement("a");
    //     aTag.href = blobUrl;
    //     aTag.setAttribute("download", file.name);
    //     document.body.appendChild(aTag);
    //     aTag.click();
    //     aTag.remove();
    //   });
    // console.log(file);
    // const response = await fetch(file.url);
    // const data = await response.blob();
    // console.log(response);
    // console.log(data);
    // console.log("file is downloaded...");
    // console.log(file.id);
    // console.log(file);
    // const filePath =
    //   currentFolder === ROOT_FOLDER
    //     ? `${currentFolder.path.join("/")}/${file.name}`
    //     : `${currentFolder.path.map((item) => item.name).join("/")}/${
    //         currentFolder.name
    //       }/${file.name}`;
    // const filesFolderRef = ref(
    //   storage,
    //   `/files/${currentUser.uid}/${filePath}`
    // );
    // console.log(filesFolderRef);
    // getDownloadURL(filesFolderRef)
    //   .then((downloadUrl) => console.log(downloadUrl))
    //   .catch((error) => console.log(error));
    // // trying with bucket
    // const fileee = getStorage().bucket("my-custom-bucket").file(filesFolderRef);
    // const publicUrl = await getDownloadURL(fileee);
    // console.log(publicUrl);
  };

  let fileIcon = <FcFile />;

  iconDictionary.map((item, index) => {
    if (file.type.startsWith(item.type)) {
      return (fileIcon = item.icon);
    }
  });

  return (
    <>
      <div className="flex flex-col gap-2 text-base p-2 pt-2.5 sm:p-2 sm:pt-3 md:p-4 rounded-xl lg:rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-opacity-40 dark:hover:bg-slate-800 dark:shadow-none shadow-2xl hover:shadow-blue-300 cursor-pointer duration-200 ">
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
              transition={{ delay: 1 }}
              src={file.url}
              alt={file.name}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          ) : (
            // </div>
            //   iconDictionary.map((item, index) => {
            //     if (file.type.startsWith(item.type)) {
            //       return (
            //         <div
            //           key={index}
            //           className="text-6xl md:text-8xl lg:text-9xl flex justify-center items-center"
            //         >
            //           {item.icon}
            //         </div>
            //       );
            //     }
            //   })

            <div className="text-6xl md:text-8xl lg:text-9xl flex justify-center items-center">
              {fileIcon}
            </div>
          )}
        </div>

        <div className="flex gap-[2px] sm:gap-0.5 lg:gap-2 items-center justify-between">
          <div className="flex justify-start items-center gap-1">
            {/* {iconDictionary.map((item, index) => {
              if (file.type.startsWith(item.type)) {
                return (
                  <div
                    key={index}
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl"
                  >
                    {item.icon}
                  </div>
                );
              }
            })} */}
            {/* file icon */}
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
              {fileIcon}
            </div>
            {/* file name */}
            <div
              onClick={handleDownload}
              className="text-xs sm:text-[12px] md:text-[14px] lg:text-base truncate duration-200"
            >
              {file.name.length > 14
                ? `${file.name.substring(0, 14)}...`
                : file.name.toString()}
            </div>
          </div>
          <Link
            to={file.url}
            onClick={handleDownload}
            target="_blank"
            className="p-0 md:p-0.5 lg:p-1 hover:text-blue-600 lg:bg-white lg:hover:bg-blue-600 lg:hover:text-white  lg:dark:bg-slate-700 lg:dark:hover:bg-blue-600 shadow-md rounded-md duration-200"
          >
            <HiOutlineDownload className="text-xl" />
          </Link>
        </div>
      </div>

      {/* File viewer */}
      {fileModel && (
        <div className="fixed inset-0 z-50 overflow-y-auto ">
          <div
            className="fixed inset-0 bg-gray-800 h-screen opacity-70 transition-opacity"
            onClick={() => setFileModel(null)}
          ></div>
          <div className="sm:min-h-screen  flex items-center justify-center sm:p-4 text-center sm:items-center ">
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
                    <article className="flex gap-3 justify-start flex-col sm:flex-row p-1 border border-slate-900 rounded-lg my-1">
                      <span className="w-full sm:w-32 font-bold text-left text-slate-500 dark:text-slate-300">
                        File Name:
                      </span>
                      <p className="w-full font-semibold text-slate-700 dark:text-slate-100 ">
                        {fileModel.name}
                      </p>
                    </article>
                    {/* file createdAt */}
                    <article className="flex gap-3 justify-start items-center flex-col sm:flex-row p-1 border border-slate-900 rounded-lg my-1">
                      <span className="w-full sm:w-32 font-bold  text-slate-500 dark:text-slate-300">
                        Created Date:
                      </span>
                      <p className="w-full font-semibold text-slate-700 dark:text-slate-100">
                        {file.createdAt.toDate().toDateString()}
                      </p>
                    </article>
                    {/* file size */}
                    <article className="flex gap-3 justify-start items-center flex-col sm:flex-row  p-1 border border-slate-900 rounded-lg my-1">
                      <span className="w-full sm:w-32 font-bold  text-slate-500 dark:text-slate-300">
                        File Size:
                      </span>
                      <p className="w-full font-semibold text-slate-700 dark:text-slate-100">
                        {(fileModel.size / 3000000).toString().slice(0, 5)} MB
                      </p>
                    </article>
                    {/* file type */}
                    <article className="flex gap-3 justify-start items-center flex-col sm:flex-row p-1 border border-slate-900 rounded-lg my-1">
                      <span className="w-full sm:w-32 font-bold  text-slate-500 dark:text-slate-300">
                        File Type:
                      </span>
                      <p className="w-full font-semibold text-slate-700 dark:text-slate-100">
                        {fileModel.type}
                      </p>
                    </article>
                    {/* file path */}
                    <article className="flex gap-3 justify-start flex-col sm:flex-row p-1 border border-slate-900 rounded-lg my-1">
                      <span className="w-full sm:w-32 font-bold  text-slate-500 dark:text-slate-300">
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
                    {/* file download */}
                    <Link
                      to={fileModel.url}
                      target="_blank"
                      className="w-10 h-10 cursor-pointer flex justify-center items-center gap-2 text-white bg-blue-500 hover:bg-blue-600 p-2 px-3 rounded-xl shadow-md duration-300"
                    >
                      {/* <span className="font-semibold text-base">Download</span> */}
                      <div className="text-xl">
                        <MdDownload />
                      </div>
                    </Link>

                    {/* file delete */}
                    <button
                      onClick={() => handleDelete(fileModel.id, fileModel.path)}
                      className="w-10 h-10 cursor-pointer flex justify-center items-center gap-2 text-white bg-rose-500 hover:bg-rose-600 p-2 rounded-xl shadow-md duration-300"
                    >
                      {/* <span className="font-semibold text-sm">Delete</span> */}
                      <div className="text-xl">
                        <MdDelete />
                      </div>
                    </button>
                  </div>
                </div>
                {/* {JSON.stringify(fileModel)} */}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default File;
