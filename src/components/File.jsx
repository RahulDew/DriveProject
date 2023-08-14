import React from "react";
import {
  FcImageFile,
  FcVlc,
  FcSpeaker,
  FcDocument,
  FcClapperboard,
  FcQuestions,
} from "react-icons/fc";

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
  return (
    <a
      href={file.url}
      target={"_blank"}
      className="flex gap-2 flex-col text-center justify-center text-base w-52 p-2 rounded-md bg-slate-800 hover:bg-slate-700 duration-200 cursor-pointer "
    >
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

      <div className="flex gap-2 items-center">
        {iconDictionary.map((item, index) => {
          if (file.name.split(".").pop() === item.type) {
            return (
              <div key={index} className="text-3xl">
                {item.icon}
              </div>
            );
          }
        })}
        <div className="truncate">{file.name}</div>
      </div>
      {/* {iconDictionary.map((item) => (
        <></>
      ))} */}
    </a>
  );
};

export default File;
