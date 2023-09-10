import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import File from "../components/File";
import Loader from "../components/Loader";
import { BiSearchAlt2 } from "react-icons/bi";
import { PiFilesFill } from "react-icons/pi";
import { FiX } from "react-icons/fi";

import { database } from "../config/firebase";
import { formatter } from "../config/firebase";
import { useAuthContext } from "../context/AuthContext";
import { query, where, onSnapshot } from "firebase/firestore";
import { FcFile, FcVideoFile, FcAudioFile, FcImageFile } from "react-icons/fc";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { currentUser, allFiles, setAllFiles } = useAuthContext();

  const handleFileSearch = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    // console.log(searchText);
    setLoading(true);
    // console.log("bhai loding set kr diya");
    setSearchTimeout(
      setTimeout(() => {
        // const searchResults = allFiles.map()
        const searchResults = allFiles.filter((file) => {
          // console.log(searchText, file.name);
          return file.name.toLowerCase().includes(searchText.toLowerCase());
        });
        console.log(searchResults);
        setSearchedFiles(searchResults);
        setLoading(false);
        // console.log("bhai loding hta diya");

        // console.log(allFiles);

        console.log("running in every 1 seconds");
        // console.log(searchText);
      }, 1000)
    );
  };

  // creating query for retriving files of the current user
  const q = query(database.files, where("userId", "==", currentUser.uid));

  // getting all the files of current user and store it to allFiles state
  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map(formatter.formatDoc);
      setAllFiles(files);
      // console.log("Bhai Sare files: ", files);
    });
  }, []);

  return (
    <div className=" ml-20 text-center bg-[#E2EFFF] min-h-screen p-6 lg:px-8">
      <Navbar />
      <div className="px-5 h-full">
        <div className="flex flex-col justify-center items-center gap-5 my-4 ">
          <h3 className="text-4xl font-bold">
            Want to find files or lost their location?
          </h3>
          <p className="text-xl font-light text-slate-500">
            Lets find your file, type the name of your file
          </p>
          <div className="w-4/6 flex items-center justify-start bg-slate-50 shadow-xl rounded-full p-2">
            <div className="bg-blue-600 text-white text-2xl px-5 p-2 ml-1 rounded-full font-bold">
              <BiSearchAlt2 />
            </div>
            <input
              onChange={handleFileSearch}
              type="text"
              value={searchText}
              placeholder="Enter name of file..."
              className="w-full bg-transparent py-1 px-4 hover:bg-opacity-40 duration-200 outline-none border-none text-[18px]"
            />
            {searchText && (
              <div
                onClick={() => setSearchText("")}
                className="text-slate-700 hover:bg-slate-100 text-2xl px-5 p-2 ml-1 rounded-full cursor-pointer duration-300"
              >
                <FiX />
              </div>
            )}
          </div>
        </div>

        <hr className="font-bold border-slate-300 my-8" />

        {/* yahann se logic chaloo */}

        {searchText ? (
          <>
            {!loading ? (
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
                  <h3 className="text-2xl text-center">No Files Found 🙁</h3>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            )}
          </>
        ) : (
          <div className="mt-28 flex justify-center items-center gap-10">
            <FcImageFile className="text-9xl " />
            <FcAudioFile className="text-9xl " />
            <FcVideoFile className="text-9xl " />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
