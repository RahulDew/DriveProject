import { useState } from "react";
import File from "../components/File";
import Loader from "../components/Loader";
import { BiSearchAlt2 } from "react-icons/bi";

import { useAuthContext } from "../context/AuthContext";
import { query, where, onSnapshot, orderBy } from "firebase/firestore";
import { database } from "../config/firebase";
import { formatter } from "../config/firebase";
import { Formik } from "formik";
import * as yup from "yup";

import { FiX } from "react-icons/fi";
import {
  FcFile,
  FcVideoFile,
  FcAudioFile,
  FcImageFile,
  FcFinePrint,
  FcDocument,
  FcAnswers,
  FcRatings,
} from "react-icons/fc";

// creating schema using yup library for validation
const fileSearchSchema = yup.object().shape({
  fileName: yup
    .string()
    .max(20, "File name not greater then 20 characters!")
    .min(2, "File name should have atleast 3 characters!")
    .trim()
    .nonNullable(),
});

// initial values for folder
const initialFileSearchValues = {
  fileName: "",
};

const Search = () => {
  // const [searchText, setSearchText] = useState("");
  const [searchText, setSearchText] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedFiles, setSearchedFiles] = useState([]);

  const { allFiles, contentLoading, setContentLoading, currentUser } =
    useAuthContext();

  // // getting all the files of current user and store it to allFiles state
  // useEffect(() => {
  //   // setContentLoading(true);
  //   console.log("bhai ye home se sare files la rha hu");
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const files = snapshot.docs.map(formatter.formatDoc);
  //     setAllFiles(files);
  //     console.log(files);
  //     //   setContentLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);

  const handleFormikFileSearch = async (values, onSubmitProps) => {
    // console.log(values);
    // console.log(values.fileName.toLowerCase());
    const q = query(
      database.files,
      where("userId", "==", currentUser.uid),
      where("lowerCaseName", ">=", values.fileName.toLowerCase()),
      where("lowerCaseName", "<=", values.fileName.toLowerCase() + "\uf8ff")
    );
    setContentLoading(true);
    console.log("bhai main usi name ke files la rha hu");
    onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map(formatter.formatDoc);
      console.log(files);
      setSearchedFiles(files);
      setContentLoading(false);
    });
    // onSubmitProps.resetForm();
  };

  // const handleFileSearch = (e) => {
  //   clearTimeout(searchTimeout);
  //   setSearchText(e.target.value);
  //   // console.log(searchText);
  //   setContentLoading(true);
  //   // console.log("bhai loding set kr diya");
  //   setSearchTimeout(
  //     setTimeout(() => {
  //       // const searchResults = allFiles.map()
  //       if (Array.isArray(allFiles) && allFiles.length) {
  //         const searchResults = allFiles.filter((file) => {
  //           // console.log(searchText, file.name);
  //           return file.name.toLowerCase().includes(searchText.toLowerCase());
  //         });
  //         console.log(searchResults);
  //         setSearchedFiles(searchResults);
  //       } else {
  //         setSearchedFiles([]);
  //         return;
  //       }

  //       setContentLoading(false);
  //       // console.log("bhai loding hta diya");

  //       // console.log(allFiles);

  //       console.log("running in every 1 seconds");
  //       // console.log(searchText);
  //     }, 1000)
  //   );
  // };

  return (
    <div className={`sm:px-5 h-full`}>
      {/* Search box contianer */}
      {/* <div className="flex flex-col justify-center items-center gap-5 my-14 "> */}
      {/* <h3 className="text-2xl sm:text-4xl font-bold">
          Want to find files or lost their location?
        </h3>
        <p className="text-lg sm:text-xl font-light text-slate-500">
          Lets find your file, type the name of your file
        </p> */}
      {/* Search box */}
      {/* <div className="pointer-events-none w-full md:w-5/6 lg:4/6 flex items-center justify-start bg-slate-50 dark:bg-slate-800 shadow-xl hover:shadow-blue-200 focus-within:shadow-blue-200 dark:shadow-none rounded-full p-2 duration-300">
          <div className="bg-blue-600 text-white text-2xl px-5 p-2 ml-1 rounded-full font-bold pointer-events-auto">
            <BiSearchAlt2 />
          </div>
          <input
            onChange={handleFileSearch}
            type="text"
            value={searchText}
            placeholder="Enter name of file..."
            id="yeInput"
            className="w-full bg-transparent py-1 px-4 hover:bg-opacity-40 duration-200 outline-none border-none text-[18px] pointer-events-auto"
          />
          {searchText && (
            <div
              onClick={() => setSearchText("")}
              className="text-slate-700 hover:bg-slate-200 text-2xl px-5 p-2 ml-1 rounded-full cursor-pointer duration-300 pointer-events-auto"
            >
              <FiX />
            </div>
          )}
        </div> */}

      {/* Search box2 */}
      <Formik
        onSubmit={handleFormikFileSearch}
        initialValues={initialFileSearchValues}
        validationSchema={fileSearchSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-5 my-14"
          >
            <h3 className="text-2xl sm:text-4xl font-bold">
              Want to find files or lost their location?
            </h3>
            <p className="text-lg sm:text-xl font-light text-slate-500">
              Lets find your file, type the name of your file
            </p>
            <div className="pointer-events-none w-full md:w-5/6 lg:4/6 flex items-center justify-start bg-slate-50 dark:bg-slate-800 shadow-xl hover:shadow-blue-200 focus-within:shadow-blue-200 dark:shadow-none rounded-full p-2 duration-300">
              <div className="bg-blue-600 text-white text-2xl px-5 p-2 ml-1 rounded-full font-bold pointer-events-auto">
                <BiSearchAlt2 />
              </div>

              <input
                type="text"
                name="fileName"
                id="fileName"
                autoFocus={true}
                value={values.fileName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter name of file..."
                className="w-full bg-transparent py-1 px-4 hover:bg-opacity-40 duration-200 outline-none border-none text-[18px] pointer-events-auto"
              />

              {values.fileName && (
                <div
                  onClick={() => resetForm()}
                  className="text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600 text-2xl px-5 p-2 ml-1 rounded-full cursor-pointer duration-300 pointer-events-auto"
                >
                  <FiX />
                </div>
              )}
            </div>
            {touched.fileName && (
              <p className=" text-blue-500 text-left text-base">
                {touched.fileName && errors.fileName}
              </p>
            )}
          </form>
        )}
      </Formik>
      {/* </div> */}

      <hr className="font-bold border-slate-300 dark:border-slate-800 my-8 duration-200" />

      {/* logic for showing files starts here */}
      {searchText ? (
        <>
          {!contentLoading ? (
            <>
              {searchedFiles.length ? (
                <div className="flex flex-row flex-wrap justify-center items-center gap-8 ">
                  {searchedFiles
                    .map((file) => (
                      <div key={file.id}>
                        <File file={file} />
                        <p className="text-xs">
                          {file.createdAt.toDate().toDateString()}
                        </p>
                      </div>
                    ))
                    .reverse()}
                </div>
              ) : (
                <div className="mt-24">
                  <h3 className="text-2xl font-light">
                    Sorry ! We don't have file with name:{" "}
                    <span className="text-blue-600">{searchText}</span>
                  </h3>
                  <div className="mt-5 flex justify-center items-center gap-3 opacity-40">
                    <FcFinePrint className="text-9xl " />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          )}
        </>
      ) : (
        <div className="mt-24">
          <h3 className="text-2xl font-light">
            Find your all files in one place
          </h3>
          <div className="mt-5 flex justify-center items-center ">
            <FcDocument className="text-9xl " />
            <FcImageFile className="text-9xl " />
            <FcAudioFile className="text-9xl " />
            <FcVideoFile className="text-9xl " />
            <FcRatings className="text-9xl " />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
