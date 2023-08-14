import React, { useState } from "react";
// import { ReactDOM } from "react";
import ReactDOM from "react-dom/client";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { storage, database, formatter } from "../config/firebase";
import { addDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";
import { v4 as uuidV4 } from "uuid";
import { useAuthContext } from "../context/AuthContext";
import { GiCancel } from "react-icons/gi";
// import { Toast, ProgressBar } from "bootstrap";
import { Toast, ProgressBar, ToastHeader } from "react-bootstrap";

const AddFileButton = ({ icon, currentFolder }) => {
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const { currentUser } = useAuthContext();
  const id = uuidV4();

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    // console.log(file);
    if (currentFolder == null || file == null) return;
    console.log(currentFolder);

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

    // console.log(currentFolder);
    // console.log(currentFolder.path);
    // console.log(filePath);
    // console.log(file);
    // console.log(file.name);

    const filesFolderRef = ref(
      storage,
      `/files/${currentUser.uid}/${filePath}`
    );
    // console.log("ja rha h...");

    const uploadTask = uploadBytesResumable(filesFolderRef, file);
    console.log("reply from server: ", uploadTask);
    // const uploadTask = await uploadBytes(filesFolderRef, file);
    // console.log("reply from server: ", uploadTask);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Uploading: ", progress);
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
            createdAt: database.currentTimeStamp,
          });
        }

        // onSnapshot(q, async (snapshot) => {
        //   // console.log(snapshot.docs);
        //   const oldFile = snapshot.docs.map(formatter.formatDoc)[0];

        //   // console.log("oldFile: ", oldFile);
        //   if (oldFile) {
        //     const oldFileRef = doc(database.files, oldFile.id);
        //     console.log("oldfile h bhai: ", oldFile);
        //     console.log("updating the old file...");
        //     // alert("file is already available!");
        //     await updateDoc(oldFileRef, { url: fileURL });
        //   } else {
        //     console.log("ab new file create kr rha hu bhai!");
        //     const fileDocRef = await addDoc(database.files, {
        //       url: fileURL,
        //       name: file.name,
        //       folderId: currentFolder.id,
        //       path: filePath,
        //       userId: currentUser.uid,
        //       createdAt: database.currentTimeStamp,
        //     });
        //   }
        // });

        //creating file document in database
        // console.log(fileDocRef);

        // rermoving the use of file uploading status whenever that file uploaded
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.filter((uploadFile) => {
            return uploadFile.id !== id;
          });
        });
      }
    );
  };

  return (
    <>
      {uploadingFiles.length > 0 && (
        <div
          // style={{
          //   position: "absolute",
          //   bottom: "1rem",
          //   right: "1rem",
          //   maxWidth: "250px",
          // }}
          className="fixed z-20 bottom-5 right-5 w-52 sm:w-64"
        >
          {uploadingFiles.map((file, index) => (
            <Toast key={file.id} className="bg-slate-700">
              <Toast.Header
                closeButton={false}
                className="flex flex-row gap-1 justify-center items-center w-100 d-block text-slate-100  bg-slate-600"
              >
                <div className="text-truncate">
                  {index + 1}. {file.name}
                </div>

                {/* close button of Toast */}
                {file.error && (
                  <button
                    onClick={() => {
                      setUploadingFiles((prevUploadingFiles) => {
                        return prevUploadingFiles.filter((uploadFile) => {
                          return uploadFile.id !== file.id;
                        });
                      });
                    }}
                  >
                    <GiCancel />
                  </button>
                )}
              </Toast.Header>
              <Toast.Body>
                <ProgressBar
                  animated={!file.error}
                  variant={file.error ? "danger" : "primary"}
                  now={file.error ? 100 : file.progress}
                  label={file.error ? "Error" : `${Math.round(file.progress)}%`}
                  className="bg-slate-300"
                />
                <div className="text-center my-2">Uploading...</div>
              </Toast.Body>
            </Toast>
          ))}
        </div>
      )}

      <div className="flex gap-2 text-center justify-left items-cener text-2xl font-semibold  text-white bg-slate-700 hover:bg-slate-600 p-2 rounded-md m-auto cursor-pointer">
        {icon}
        <div className="text-base b-2">File</div>
        <input
          type="file"
          onChange={handleUploadFile}
          style={{ opacity: 0, position: "absolute", width: "60px" }}
        />
      </div>
    </>
  );
};

export default AddFileButton;
