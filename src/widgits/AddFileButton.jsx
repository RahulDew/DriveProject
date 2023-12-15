import React, { useState } from "react";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { storage, database, formatter } from "../config/firebase";
import { addDoc, updateDoc } from "firebase/firestore";
import { getDocs, doc, query, where } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";
import { useAuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LuFilePlus2 } from "react-icons/lu";
import { FiUploadCloud } from "react-icons/fi";

import FileDropZone from "./FileDropZone";
import { FcFile } from "react-icons/fc";
import PopupWrapper from "../components/PopupWrapper";
// import Loader from "../components/Loader";

const AddFileButton = ({ icon, currentFolder, button }) => {
  const [isFilemodelOpen, setIsFileModelOpen] = useState(false);
  const [files, setFiles] = useState([]);
  // console.log(files);

  const { currentUser, setUploadingFiles, handleShowToast } = useAuthContext();

  const handleUploadFiles = async () => {
    //copy files state data to uploadableFiles variable
    let uploadableFiles = files;
    // console.log(uploadableFiles);

    //clearing the fileData State
    setFiles([]);
    let promices = [];
    let uplodedFiles = [];

    if (currentFolder == null || files == null) return;

    try {
      uploadableFiles.map((file) => {
        //creating unique upload id for each objects in Uploading files
        const uploadId = uuidV4();
        setUploadingFiles((prevUploadingFiles) => [
          ...prevUploadingFiles,
          {
            id: uploadId,
            name: file.name,
            progress: 0,
            size: file.size,
            error: false,
          },
        ]);
        // console.log(uploadId);
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
        // console.log("reply from server: ", uploadTask);
        promices.push(uploadTask);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadingFiles((prevUploadingFiles) => {
              return prevUploadingFiles.map((uploadFile) => {
                if (uploadFile.id === uploadId) {
                  return { ...uploadFile, progress: progress };
                }
                return uploadFile;
              });
            });
          },
          (err) => {
            setUploadingFiles((prevUploadingFiles) => {
              return prevUploadingFiles.map((uploadFile) => {
                if (uploadFile.id === uploadId) {
                  return { ...uploadFile, error: true };
                }
                return uploadFile;
              });
            });
            // console.log("Can't upload: ", err);
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
            // console.log("yahan se ho rha h ");

            const oldFilesRef = await getDocs(q);
            const formattedOldFile = oldFilesRef.docs.map(
              formatter.formatDoc
            )[0];
            // console.log("formattedoldFile: ", formattedOldFile);
            // console.log("oldfile: ", oldFile.docs.map(formatter.formatDoc)[0]);
            if (formattedOldFile) {
              // console.log("oldfile h bhai: ", oldFile);
              // console.log("updating the old file...");
              // alert("file is already available!");
              const oldFileRef = doc(database.files, formattedOldFile.id);
              await updateDoc(oldFileRef, { url: fileURL });
            } else {
              // console.log("ab new file create kr rha hu bhai!");
              const fileDocRef = await addDoc(database.files, {
                url: fileURL,
                name: file.name,
                fileSearchName: file.name.toLowerCase(),
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
              return prevUploadingFiles.filter((uploadFile) => {
                return uploadFile.id !== uploadId;
              });
            });
            uplodedFiles.push(file.name);
          }
        );
        // console.log(promices);
      });
      handleShowToast(
        `uploading ${promices?.length} ${
          promices?.length > 1 ? "Files" : "File"
        }`,
        "success"
      );
    } catch (error) {
      // console.log(error);
      alert(`failed to upload ${promices?.length - uploadableFiles?.length}`);
      handleShowToast(
        `failed to upload ${promices?.length - uploadableFiles?.length}`,
        "failure"
      );
    }

    setIsFileModelOpen(false);
  };

  const handleCloseFileModel = () => {
    setIsFileModelOpen(false);
    setFiles([]);
  };

  // const fileKeyDownHandler = (e) => {
  //   if (e.keyCode === 32 && e.ctrlKey) setIsFileModelOpen(true);
  // };

  // window.addEventListener("keydown", fileKeyDownHandler);

  return (
    <>
      {button ? (
        <div
          onClick={() => setIsFileModelOpen(true)}
          className={`cursor-pointer text-2xl p-2 
          bg-blue-600 text-white hover:bg-blue-700 
        flex justify-center items-center gap-1 rounded-xl shadow-md duration-300 font-semibold`}
        >
          <LuFilePlus2 />
          <div className="hidden md:block text-lg b-2">File</div>
        </div>
      ) : (
        <>
          <FcFile className="text-6xl sm:text-8xl cursor-pointer opacity-70 dark:opacity-60 " />
          <div
            onClick={() => setIsFileModelOpen(true)}
            className="mt-2 p-2 px-4 flex justify-center items-center gap-2 cursor-pointer rounded-xl bg-transparent dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 text-blue-400 dark:text-blue-300 md:dark:hover:text-blue-400 duration-200"
          >
            <LuFilePlus2 className="text-3xl cursor-pointer" />
            <span className="text-sm sm:text-lg font-semibold">Add Files</span>
          </div>
        </>
      )}

      {/* Add file Model */}
      {isFilemodelOpen && (
        <PopupWrapper handleWrapperClose={handleCloseFileModel}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full relative transform overflow-hidden mx-5 sm:mx-auto rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-slate-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl"
          >
            {/* main content */}
            <div className="flex flex-col justify-center items-center gap-5 px-6 pb-4 pt-5 sm:p-6 sm:pb-4">
              <h3 className="font-semibold text-xl">Upload your files</h3>
              <div
                className={`w-full sm:w-10/12 h-56 flex justify-center items-center border-2 border-dashed ${
                  Array.isArray(files) && files.length
                    ? "border-blue-600"
                    : "border-slate-600 dark:border-slate-300 "
                } rounded-xl`}
              >
                <FileDropZone files={files} setFiles={setFiles} />
              </div>
              <button
                type="submit"
                disabled={Array.isArray(files) && files.length ? false : true}
                onClick={handleUploadFiles}
                className={`${
                  Array.isArray(files) && files.length
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                } w-32 my-2 flex justify-center items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 p-3 text-[17px] font-semibold leading-6 text-white shadow-md duration-300`}
              >
                <FiUploadCloud className="text-2xl" />
                <span>Upload</span>
              </button>
            </div>
          </motion.div>
        </PopupWrapper>
      )}
    </>
  );
};

export default AddFileButton;
