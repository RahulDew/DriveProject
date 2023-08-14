import React, { useState } from "react";
import { database, operation } from "../config/firebase";
import { addDoc } from "firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import { ROOT_FOLDER } from "../hooks/useFolder";

const AddFolderButton = ({ icon, currentFolder }) => {
  const [modelOpen, setModelOpen] = useState(false);
  const [name, setName] = useState("");
  const [loader, setLoader] = useState(false);

  const { currentUser } = useAuthContext();

  // console.log(operation.getFolderDoc("m4YTWmJCKy5ji5UraJEI"));

  const handleOpenModel = () => {
    setModelOpen(true);
  };
  const handleCloseModel = () => {
    setModelOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentFolder === null) return; //if currentfolder is null then return

    //creating path for folder
    // console.log(currentFolder);
    const path = [...currentFolder.path];
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id });
    }

    setLoader(true); // activate loader
    // Creating folder in databse
    const folderDocRef = await addDoc(database.folders, {
      name: name,
      userId: currentUser.uid,
      parentId: currentFolder.id,
      path: path,
      createdAt: database.currentTimeStamp,
    });
    console.log(folderDocRef);
    // const folderDocRefData = await folderDocRef.data();
    // console.log(folderDocRefData);

    //clearing model for reopening empty
    setName("");
    setLoader(null);
    handleCloseModel();
  };

  return (
    <>
      <button
        onClick={handleOpenModel}
        className="flex gap-2 text-center justify-left items-cener text-2xl font-semibold text-white bg-slate-700 hover:bg-slate-600  p-2 rounded-md m-auto cursor-pointer"
      >
        {icon}
        <div className="text-base b-2">Folder</div>
      </button>

      {/* Add Folder or File Model */}
      {modelOpen && (
        <div class="fixed inset-0 z-10 overflow-y-auto ">
          <div class="fixed inset-0 bg-gray-800 opacity-70 transition-opacity"></div>
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <form
                onSubmit={handleSubmit}
                class="flex flex-col gap-3 text-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
              >
                <h2 className="font-semibold text-xl">Enter Folder Name </h2>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-1 p-3 text-lg outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:leading-6"
                />
                <div class="bg-gray-50 py-3 flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={handleCloseModel}
                    className="flex w-full justify-center rounded-md bg-slate-500 hover:bg-slate-600 duration-150 p-3  text-sm font-semibold leading-6 text-white shadow-sm "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-500  hover:bg-indigo-600 duration-150 p-3  text-sm font-semibold leading-6 text-white shadow-sm"
                  >
                    Upload
                  </button>
                </div>
                {loader && (
                  <div role="status" className="my-3 text-center">
                    <svg
                      aria-hidden="true"
                      class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFolderButton;
