import React, { useState } from "react";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { storage, database, formatter } from "../config/firebase";
import { addDoc, updateDoc } from "firebase/firestore";
import { getDocs, doc, query, where } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";
import { useAuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

import FileDropZone from "./FileDropZone";
import Loader from "../components/Loader";

const AddFileButton = ({ icon, currentFolder }) => {
  const [modelOpen, setModelOpen] = useState(false);
  const [fileData, setFileData] = useState(null);

  const { currentUser, setUploadingFiles, uploadingFiles } = useAuthContext();
  const id = uuidV4();

  const handleUploadFile = async () => {
    //copy fileData state to file variable
    let file = fileData;
    // console.log(file);

    //clearing the fileData State
    setFileData(null);

    if (currentFolder == null || file == null) return;

    setUploadingFiles((prevUploadingFiles) => [
      ...prevUploadingFiles,
      { id: id, name: file.name, progress: 0, error: false },
    ]);

    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.map((item) => item.name).join("/")}/${
            currentFolder.name
          }/${file.name}`;

    const filesFolderRef = ref(
      storage,
      `/files/${currentUser.uid}/${filePath}`
    );
    // console.log("ja rha h...");

    const uploadTask = uploadBytesResumable(filesFolderRef, file);
    console.log("reply from server: ", uploadTask);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress };
            }
            return uploadFile;
          });
        });
      },
      (err) => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true };
            }
            return uploadFile;
          });
        });
        console.log("Can't upload: ", err);
      },
      async () => {
        //gettting the file URL
        const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

        // updating the already available document using query
        const q = query(
          database.files,
          where("name", "==", file.name),
          where("userId", "==", currentUser.uid),
          where("folderId", "==", currentFolder.id)
        );
        console.log("yahan se ho rha h ");

        const oldFilesRef = await getDocs(q);
        const formattedOldFile = oldFilesRef.docs.map(formatter.formatDoc)[0];
        console.log("formattedoldFile: ", formattedOldFile);
        // console.log("oldfile: ", oldFile.docs.map(formatter.formatDoc)[0]);
        if (formattedOldFile) {
          // console.log("oldfile h bhai: ", oldFile);
          console.log("updating the old file...");
          // alert("file is already available!");
          const oldFileRef = doc(database.files, formattedOldFile.id);
          await updateDoc(oldFileRef, { url: fileURL });
        } else {
          console.log("ab new file create kr rha hu bhai!");
          const fileDocRef = await addDoc(database.files, {
            url: fileURL,
            name: file.name,
            folderId: currentFolder.id,
            path: filePath,
            userId: currentUser.uid,
            type: file.type,
            size: file.size,
            createdAt: database.currentTimeStamp,
          });
        }

        // rermoving the use of file uploading status whenever that file uploaded
        setUploadingFiles((prevUploadingFiles) => {
          // setfileUploadProgress(0);
          return prevUploadingFiles.filter((uploadFile) => {
            return uploadFile.id !== id;
          });
        });
      }
    );

    setModelOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setModelOpen(true)}
        className="flex gap-2 text-center justify-left items-cener text-2xl font-semibold  text-white bg-slate-700 hover:bg-slate-600 p-2 rounded-md m-auto cursor-pointer"
      >
        {icon}
        <div className="text-base b-2">File</div>
      </div>

      {/* Add file Model */}

      {modelOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div
            onClick={() => setModelOpen(false)}
            className="fixed inset-0 bg-gray-800 opacity-70 transition-opacity"
          ></div>
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              {/* main content */}
              <div className="flex flex-col justify-center items-center gap-3 text-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="font-semibold text-xl">Upload your file</h3>
                {/* <div className=""> */}
                <FileDropZone
                  file={fileData}
                  setFile={setFileData}
                  fileType={"any"}
                  styles={"w-80 p-10"}
                />
                <button
                  type="submit"
                  onClick={handleUploadFile}
                  className={`${
                    fileData ? "cursor-pointer" : "cursor-not-allowed"
                  } w-32 my-2 rounded-md bg-blue-600  hover:bg-blue-700 p-3 text-[17px] font-semibold leading-6 text-white shadow-md duration-300`}
                >
                  Upload
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFileButton;
