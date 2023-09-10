import React from "react";

import Dropzone from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

const FileDropZone = ({ file, setFile, styles }) => {
  return (
    <div
      className={`border-2 border-dashed ${
        file ? "border-blue-600" : "border-slate-500"
      } rounded-md my-2`}
    >
      <Dropzone
        acceptedFiles={`.jpg, .jpeg, .png, .webp`}
        multiple={false}
        onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
        // maxSize={1048576}
        // onBlur={handleBlur}
        // onChange={handleChange}
        // name="profileImageFile"
        // id="profileImageFile"
        // onChange={handleChange}
      >
        {({
          getInputProps,
          getRootProps,
          isDragActive,
          isDragReject,
          isDragAccept,
        }) => (
          <div {...getRootProps()} className={`${styles} cursor-copy`}>
            <input {...getInputProps()} />
            <div className={`flex flex-col justify-center items-center `}>
              {/* {isDragReject ? (
                                <p>This File should less then 1MB</p>
                              ) : ( */}
              <>
                <FiUploadCloud
                  className={`text-4xl ${
                    file ? "text-blue-600" : "text-slate-500"
                  }`}
                />
                {!file ? (
                  <p className="text-slate-600">Add or Drop Picture here...</p>
                ) : (
                  <p className="text-blue-600 font-semibold">
                    {file && file.name}
                  </p>
                )}
              </>
              {/* )} */}
            </div>
          </div>
        )}
      </Dropzone>
      {/* <p className="text-red-500 text-left text-sm">
        {touched.profileImageFile && errors.profileImageFile}
      </p> */}
    </div>
  );
};

export default FileDropZone;
