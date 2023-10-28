import React from "react";
import { motion, progress } from "framer-motion";

const UploadingFileCard = ({ file, index }) => {
  return (
    <div
      key={file.id}
      className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg sm:rounded-xl flex flex-col gap-2"
    >
      <div className="flex gap-2 flex-row justify-center items-center bg-slate-50 dark:bg-slate-800">
        <div className=" text-sm sm:text-base truncate">
          {index + 1}. {file.name}
        </div>

        {/* close button for file uploading card */}
        {file.error && (
          <button
            onClick={() => {
              setUploadingFiles((prevUploadingFiles) => {
                return prevUploadingFiles.filter((uploadFile) => {
                  return uploadFile.id !== file.id;
                });
              });
            }}
            className="bg-slate-500 p-1 rounded-full text-lg cursor-pointer"
          >
            <GiCancel />
          </button>
        )}
      </div>

      {/* Line spaceing */}
      <hr className="border-slate-300 dark:border-slate-700" />

      {/* Progress Barand and State */}
      <div className="bg-slate-300 w-full h-4 rounded-md shadow-xl">
        <motion.div
          style={{ width: `${Math.round(file.progress)}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(file.progress)}%` }}
          className={`h-full rounded-md text-white text-xs transition-all duration-300 ease-out bg-gradient-to-r from-cyan-700 ${
            !file.error ? " to-blue-700  " : "to-red-400"
          }`}
        >
          {!file.error ? Math.round(file.progress) : "!!!"}%
        </motion.div>
      </div>
      <div className="text-center text-sm font-semibold">
        {!file.error
          ? `Uploading... ${
              file?.size
                ? ` ${(file.size / 1000000).toString().slice(0, 4)} MB`
                : ""
            }` 
          : "Error!!!"}
      </div>
    </div>
  );
};

export default UploadingFileCard;
