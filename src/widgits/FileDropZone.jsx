import React from "react";

import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

// const typeValidator = (file) => {
//   if (file.type.startsWith("image/")) {
//     if (file.size > 1024 * 1024) {
//       // 3MB limit
//       return {
//         code: "size-too-large",
//         message: "File is larger than 1MB",
//       };
//     }
//   }
//   return null;
// };

const FileDropZone = ({ setFieldValue, values, fileType, files, setFiles }) => {
  const imageFileDropZone = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    onDrop: (acceptedFiles) => {
      setFieldValue("profileImageFile", acceptedFiles[0]);
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 1048576,
  });

  const allFilesDropZone = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
    multiple: true,
    maxFiles: 5,
  });

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = fileType == "image" ? imageFileDropZone : allFilesDropZone;

  const fileRejectionItems = fileRejections.map(({ file, errors }, index) => (
    <div key={file.path}>
      <>
        {/* {file.path} - {file.size} bytes
        {errors.map((e) => (
          <p key={e.code}>
            {e.message}
            {index}
          </p>
        ))} */}
      </>
      {index == 0 && (
        <>
          {errors.map((e) => (
            <p key={e.code}>
              {e.message == "File is larger than 1048576 bytes"
                ? "File must be less than 1 MB"
                : e.message}
            </p>
          ))}
        </>
      )}
    </div>
  ));

  return (
    <>
      <div
        {...getRootProps()}
        className={`${isDragReject && "bg-red-200 dark:bg-red-950"} ${
          isDragAccept && "bg-blue-200 dark:bg-blue-950"
        } p-3 h-full w-full cursor-copy`}
      >
        <input {...getInputProps()} />
        <div className="h-full flex flex-col justify-center items-center font-semibold text-center break-all">
          {values && fileType == "image" ? (
            <>
              <FiUploadCloud
                className={`text-4xl ${
                  values.profileImageFile ? "text-blue-600" : "text-slate-500"
                }`}
              />
              {isDragReject && (
                <p className="text-red-500">File is not accepctable</p>
              )}
              {!values.profileImageFile ? (
                <p className="text-slate-600">Add or Drop Picture here...</p>
              ) : (
                <p className="text-blue-600 truncate break-all">
                  {values.profileImageFile &&
                  values.profileImageFile.name.length > 30
                    ? `${values.profileImageFile.name.substring(
                        0,
                        30
                      )}..${values.profileImageFile.name.substr(-4)}`
                    : values.profileImageFile.name.toString()}
                </p>
              )}
            </>
          ) : (
            <>
              <FiUploadCloud
                className={`text-4xl ${
                  Array.isArray(files) && files.length
                    ? "text-blue-600"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              />
              {isDragReject && (
                <p className="text-red-500">Files are not accepctable</p>
              )}
              {!files.length ? (
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Click to add or drop files here...
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Max files could be 5
                  </p>
                </div>
              ) : (
                <div className="text-blue-600">
                  {files.length &&
                    files.map((file, index) => (
                      <div
                        key={index}
                        className="flex gap-2 justify-center items-center text-base"
                      >
                        <p>
                          {file.name && file.name.length > 22
                            ? `${file.name.substr(0, 22)}..${file.name.substr(
                                -4
                              )}`
                            : file.name.toString()}
                        </p>
                        <span className="text-xs sm:text-base">
                          ( {(file.size / 1000000).toString().slice(0, 4)} MB)
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
          <div className="text-red-500">{fileRejectionItems}</div>
        </div>
      </div>
      {/* <div className="text-red-500">
        {acceptedFiles.map((acceptedFile, index) => (
          <p key={index}>{acceptedFile.name}</p>
        ))}
      </div> */}
    </>
  );
};

export default FileDropZone;
