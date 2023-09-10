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
// import { vHiOutlineDotsVertical } from "react-icons/hi";
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
} from "react-icons/fc";
import { MdDelete, MdDownload } from "react-icons/md";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";

const iconDictionary = [
  {
    type: "jpg",
    icon: <FcImageFile />,
    preview: "image",
  },
  {
    type: "png",
    icon: <FcImageFile />,
    preview: "image",
  },
  {
    type: "jpeg",
    icon: <FcImageFile />,
    preview: "image",
  },
  {
    type: "webp",
    icon: <FcImageFile />,
    preview: "image",
  },
  {
    type: "doc",
    icon: <FcImageFile />,
    preview: "document",
  },
  {
    type: "mp4",
    icon: <FcClapperboard />,
    preview: "video",
  },
  {
    type: "mp3",
    icon: <FcSpeaker />,
    preview: "song",
  },
  {
    type: "pdf",
    icon: <FcImageFile />,
    preview: "document",
  },
  {
    type: "mkv",
    icon: <FcVlc />,
    preview: "video",
  },
];

const File = ({ file, currentFolder }) => {
  const [fileModel, setFileModel] = useState(null);
  const { currentUser } = useAuthContext();

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
  };

  const handleDownload = async (file) => {
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
    console.log(file);
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

  return (
    <>
      <div className="flex flex-col gap-1 text-base p-2 rounded-lg bg-slate-500 bg-opacity-30 shadow-xl hover:bg-opacity-40 duration-300 cursor-pointer ">
        <div
          onClick={() => setFileModel(file)}
          className="m-auto w-56 h-56 flex justify-center items-center"
        >
          {["jpg", "png", "jpeg", "svg", "webp"].includes(
            file.name.split(".").pop()
          ) ? (
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
            iconDictionary.map((item, index) => {
              if (file.name.split(".").pop() === item.type) {
                return (
                  <div key={index} className="text-8xl m-auto">
                    {item.icon}
                  </div>
                );
              }
            })
          )}
        </div>

        <div className="flex gap-2 items-center justify-between">
          <div className="flex justify-start items-center gap-2">
            {iconDictionary.map((item, index) => {
              if (file.name.split(".").pop() === item.type) {
                return (
                  <div key={index} className="text-xl sm:text-3xl">
                    {item.icon}
                  </div>
                );
              }
            })}
            <div className="truncate text-xs sm:text-lg">
              {file.name.length > 14
                ? `${file.name.substring(0, 15)}...`
                : file.name.toString()}
            </div>
          </div>
          <div
            onClick={() => setFileModel(file)}
            className=" w-7 p-1 bg-white hover:bg-blue-600 hover:text-white duration-300 shadow-md  rounded-md"
          >
            <BiDotsVerticalRounded className="text-xl" />
          </div>
        </div>

        {/* <div className=" hidden sm:flex justify-between ">
          <div
            onClick={() => handleDelete(file.id, file.path)}
            className=" w-7 p-1 bg-white hover:bg-blue-600 hover:text-white duration-300 shadow-md  rounded-md"
          >
            <MdDelete className="text-xl" />
          </div>
          <div
            onClick={() => handleDownload(file)}
            className=" w-7 p-1 bg-white  hover:bg-blue-600 hover:text-white duration-300 shadow-md  rounded-md"
          >
            <MdDownload className="text-xl" />
          </div>
          <div
            onClick={() => setFileModel(file)}
            className=" w-7 p-1 bg-white hover:bg-blue-600 hover:text-white duration-300 shadow-md  rounded-md"
          >
            <BiDotsVerticalRounded className="text-xl" />
          </div>
        </div> */}
      </div>
      {fileModel && (
        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div
            className="fixed inset-0 bg-gray-800 h-screen opacity-70 transition-opacity"
            onClick={() => setFileModel(null)}
          ></div>
          <div className="min-h-screen flex items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              // whileHover={{ opacity: 0.8 }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl"
            >
              <div className="flex flex-col p-5 justify-center items-center text-[17px] ">
                {/* file Preview */}
                <div className="w-11/12 h-[30rem] flex justify-center items-center border-2 border-slate-200 rounded-2xl shadow-md">
                  {fileModel.type.includes("image") && (
                    <img
                      src={fileModel.url}
                      alt={fileModel.name}
                      className="object-contain h-full w-full rounded-xl"
                    />
                  )}
                  {fileModel.type.includes("video") && (
                    <ReactPlayer
                      url={fileModel.url}
                      controls
                      width={"100%"}
                      height={"100%"}
                    />
                  )}
                  {fileModel.type.includes("audio") && (
                    <ReactPlayer
                      url={fileModel.url}
                      controls
                      width={"100%"}
                      height={"100%"}
                    />
                  )}
                </div>
                <div className="w-full flex gap-2 mt-3 px-8 justify-between">
                  {/* file details */}
                  <div className=" flex flex-col">
                    <article className="flex gap-3 justify-start items-center p-1 ">
                      <span className="w-32 font-bold  text-slate-500">
                        File Name:
                      </span>
                      <p className="w-96 font-semibold text-slate-700 truncate ">
                        {fileModel.name}
                      </p>
                    </article>
                    {/* file createdAt */}
                    <article className="flex gap-3 justify-start items-center p-1 ">
                      <span className="w-32 font-bold  text-slate-500">
                        Created Date:
                      </span>
                      <p className="font-semibold text-slate-700">
                        {file.createdAt.toDate().toDateString()}
                      </p>
                    </article>
                    {/* file size */}
                    <article className="flex gap-3 justify-start items-center  p-1 ">
                      <span className="w-32 font-bold  text-slate-500">
                        File Size:
                      </span>
                      <p className="font-semibold text-slate-700">
                        {(fileModel.size / 1000000).toString().slice(0, 4)} MB
                      </p>
                    </article>
                    {/* file type */}
                    <article className="flex gap-3 justify-start items-center  p-1 ">
                      <span className="w-32 font-bold  text-slate-500">
                        File Type:
                      </span>
                      <p className="font-semibold text-slate-700">
                        {fileModel.type}
                      </p>
                    </article>
                    {/* file path */}
                    <article className="flex gap-3 justify-start items-center  p-1 ">
                      <span className="min-w-[8rem] font-bold  text-slate-500">
                        File Path:
                      </span>
                      <p className="font-semibold text-slate-700 ">
                        {fileModel.path}
                      </p>
                    </article>
                  </div>
                  {/* Buttons */}
                  <div className="flex flex-col justify-center gap-3">
                    {/* file delete */}
                    <article
                      onClick={() => handleDelete(fileModel.id, fileModel.path)}
                      className="w-10 h-10 cursor-pointer flex justify-center items-center gap-2 text-white bg-rose-500 hover:bg-rose-600 p-2 rounded-xl shadow-md duration-300"
                    >
                      {/* <span className="font-semibold text-sm">Delete</span> */}
                      <div className="text-xl">
                        <MdDelete />
                      </div>
                    </article>
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
                    {/* close Modal */}
                    <article
                      onClick={() => setFileModel(null)}
                      className="w-10 h-10 cursor-pointer flex justify-center items-center gap-2 text-black bg-slate-300 p-2 px-3 rounded-xl shadow-md duration-300"
                    >
                      {/* <span className="font-bold text-base">Close</span> */}
                      <div className="text-xl">
                        <MdClose />
                      </div>
                    </article>
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
