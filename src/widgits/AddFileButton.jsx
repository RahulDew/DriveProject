import React, { useState } from "react";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { storage, database, formatter } from "../config/firebase";
import { addDoc, updateDoc } from "firebase/firestore";
import { getDocs, doc, query, where } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";
import { useAuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { AiFillFileAdd } from "react-icons/ai";

import FileDropZone from "./FileDropZone";
// import Loader from "../components/Loader";

const AddFileButton = ({ icon, currentFolder, mobileNav }) => {
  const [modelOpen, setModelOpen] = useState(false);
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

    if (currentFolder == null || files == null) return;

    uploadableFiles.map((file, index) => {
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
      console.log(uploadId);
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
          // console.log("yahan se ho rha h ");

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
              lowerCaseName: file.name.toLowerCase(),
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
        }
      );
      // console.log(promices);
    });

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
    // console.log("ja rha h...");

    // const uploadTask = uploadBytesResumable(filesFolderRef, file);
    // console.log("reply from server: ", uploadTask);

    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     setUploadingFiles((prevUploadingFiles) => {
    //       return prevUploadingFiles.map((uploadFile) => {
    //         if (uploadFile.id === id) {
    //           return { ...uploadFile, progress: progress };
    //         }
    //         return uploadFile;
    //       });
    //     });
    //   },
    //   (err) => {
    //     setUploadingFiles((prevUploadingFiles) => {
    //       return prevUploadingFiles.map((uploadFile) => {
    //         if (uploadFile.id === id) {
    //           return { ...uploadFile, error: true };
    //         }
    //         return uploadFile;
    //       });
    //     });
    //     console.log("Can't upload: ", err);
    //   },
    //   async () => {
    //     //gettting the file URL
    //     const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

    //     // updating the already available document using query
    //     const q = query(
    //       database.files,
    //       where("name", "==", file.name),
    //       where("userId", "==", currentUser.uid),
    //       where("folderId", "==", currentFolder.id)
    //     );
    //     console.log("yahan se ho rha h ");

    //     const oldFilesRef = await getDocs(q);
    //     const formattedOldFile = oldFilesRef.docs.map(formatter.formatDoc)[0];
    //     console.log("formattedoldFile: ", formattedOldFile);
    //     // console.log("oldfile: ", oldFile.docs.map(formatter.formatDoc)[0]);
    //     if (formattedOldFile) {
    //       // console.log("oldfile h bhai: ", oldFile);
    //       console.log("updating the old file...");
    //       // alert("file is already available!");
    //       const oldFileRef = doc(database.files, formattedOldFile.id);
    //       await updateDoc(oldFileRef, { url: fileURL });
    //     } else {
    //       console.log("ab new file create kr rha hu bhai!");
    //       const fileDocRef = await addDoc(database.files, {
    //         url: fileURL,
    //         name: file.name,
    //         folderId: currentFolder.id,
    //         path: filePath,
    //         userId: currentUser.uid,
    //         type: file.type,
    //         size: file.size,
    //         createdAt: database.currentTimeStamp,
    //       });
    //     }

    //     // rermoving the use of file uploading status whenever that file uploaded
    //     setUploadingFiles((prevUploadingFiles) => {
    //       // setfileUploadProgress(0);
    //       return prevUploadingFiles.filter((uploadFile) => {
    //         return uploadFile.id !== id;
    //       });
    //     });
    //   }
    // );

    setModelOpen(false);
    handleShowToast(`uploading ${promices?.length}`, "success");
  };

  return (
    <>
      <div
        onClick={() => setModelOpen(true)}
        className={`cursor-pointer text-2xl p-2 
          bg-blue-600 text-white hover:bg-blue-700 
        flex justify-center items-center gap-1 rounded-xl shadow-md duration-300 font-semibold`}
      >
        <AiFillFileAdd />
        <div className="hidden md:block text-lg b-2">File</div>
      </div>

      {/* Add file Model */}
      {modelOpen && (
        <div className="fixed inset-0 z-30 overflow-y-auto ">
          <div
            onClick={() => {
              setModelOpen(false);
              setFiles([]);
            }}
            className="fixed inset-0 bg-gray-800 opacity-70 dark:bg-slate-950 dark:opacity-80 transition-opacity"
          ></div>
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            {/* main content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full relative transform overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-slate-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              {/* main content */}
              <div className="flex flex-col justify-center items-center gap-5 px-6 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="font-semibold text-xl">Upload your files</h3>
                {/* <div className=""> */}
                <div
                  className={`w-full sm:w-96 h-44 flex justify-center items-center border-2 border-dashed ${
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
                  } w-32 my-2 rounded-xl bg-blue-600 hover:bg-blue-700 p-3 text-[17px] font-semibold leading-6 text-white shadow-md duration-300`}
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
