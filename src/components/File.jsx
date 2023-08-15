import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { database, db } from "../config/firebase";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { useAuthContext } from "../context/AuthContext";

import {
  FcImageFile,
  FcVlc,
  FcSpeaker,
  FcDocument,
  FcClapperboard,
  FcQuestions,
} from "react-icons/fc";
import { MdDelete } from "react-icons/md";

const fileIcon = () => {};

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

const File = ({ file }) => {
  const { currentUser } = useAuthContext();

  //handeling the delete functionality
  const handleDelete = async (fileId) => {
    console.log(fileId);
    //deleting the file from FireStore Database
    const fileRef = doc(db, "files", file.id);
    await deleteDoc(fileRef);

    //deleting the file from Firebase Storage
    const storageFileref = ref(
      storage,
      `/files/${currentUser.uid}/${file.path}`
    );
    console.log(storageFileref);
    await deleteObject(storageFileref);
    console.log("ho gye file delete storage se...");
  };

  return (
    <div className="flex gap-2 flex-col text-center justify-center text-base w-52 p-2 rounded-md bg-slate-800 hover:bg-slate-700 duration-200 cursor-pointer ">
      <a href={file.url} target={"_blank"}>
        {["jpg", "png", "jpeg", "svg", "webp"].includes(
          file.name.split(".").pop()
        ) ? (
          <img src={file.url} alt={file.name} className="bg-cover rounded-sm" />
        ) : (
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
      </a>

      <div className="flex gap-2 items-center justify-between">
        {iconDictionary.map((item, index) => {
          if (file.name.split(".").pop() === item.type) {
            return (
              <div key={index} className="text-3xl">
                {item.icon}
              </div>
            );
          }
        })}
        <div className="truncate">
          {file.name.length > 14
            ? `${file.name.substring(0, 14)}...`
            : file.name.toString()}
        </div>
        <div
          onClick={() => handleDelete(file.id)}
          className="p-1 bg-slate-700 hover:bg-slate-500 duration-300 rounded-full"
        >
          <MdDelete className="text-xl" />
        </div>
      </div>
      {/* <div>{file.id}</div> */}
    </div>
  );
};

export default File;
