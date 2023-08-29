import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import File from "../components/File";
import { database } from "../config/firebase";
import { formatter } from "../config/firebase";
import { useAuthContext } from "../context/AuthContext";
import { getDocs, query, where, onSnapshot } from "firebase/firestore";
import Loader from "../components/Loader";
// import { Timestamp } from "firebase/firestore";

const Recents = () => {
  const [allFiles, setAllFiles] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);

  // states  forsearchin files
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  //getting current user
  const { currentUser } = useAuthContext();

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

  const q = query(database.files, where("userId", "==", currentUser.uid));

  useEffect(() => {
    // const getAllFiles = async () => {
    //   const FilesResponse = await getDocs(q);
    //   const Files = FilesResponse.docs.map(formatter.formatDoc);
    //   console.log(Files);
    // //   setAllFiles(Files);
    // };
    // getAllFiles();
    setLoading(true);
    // console.log("bhai loding set kr diya");
    onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map(formatter.formatDoc);
      setAllFiles(files);
      // console.log("Bhai Sare files: ", files);

      // recently added files within 10 days
      const recentlyAddedFiles = files.filter((file) => {
        if (new Date() - file.createdAt.toDate() <= 900000000) {
          // console.log(new Date() - file.createdAt.toDate());
          // console.log(file);
          return file;
        }
      });
      setRecentFiles(recentlyAddedFiles);
      setLoading(false);
      // console.log("bhai loding hta diya");
      console.log("Recents files: ", recentlyAddedFiles);
    });
  }, []);

  // const getFileUploadDaysDiff = (createdAt) => {
  //   // console.log(JSON.stringify(createdAt.toDate())); //befor
  //   // console.log(JSON.stringify(new Date()));
  //   const createdAtDate = createdAt.toDate();
  //   const currentDate = new Date();
  //   const difference = currentDate - createdAtDate;
  //   console.log(difference);

  //   const daysDifference = Math.floor(700000000 / (1000 * 60 * 60 * 24));
  //   console.log(daysDifference);
  // };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 lg:px-8">
      <Navbar />
      <div className="px-5">
        <div className="flex justify-between items-center my-4 ">
          <h3 className="text-white text-xl font-semibold">
            Search your Files:{" "}
          </h3>
          <input
            onChange={handleFileSearch}
            type="text"
            placeholder="Enter name of file..."
            className="w-10/12 py-2 px-4 bg-slate-600 text-white outline-none border-none text-base rounded-md"
          />
        </div>

        <hr className="font-bold border-slate-600 my-5" />

        {!searchText ? (
          <>
            <div className="my-5">
              <h1 className="text-white text-xl font-semibold">Recent Files</h1>
            </div>
            {!loading ? (
              <>
                {recentFiles.length ? (
                  <div className="flex flex-row flex-wrap justify-center items-center gap-5 ">
                    {recentFiles
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
                  <h2 className="text-center">No Recent Files Available🪹</h2>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center ">
                <Loader />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="my-5 flex gap-5 items-center">
              <h1 className="text-white text-xl font-semibold">
                Search Files for:
              </h1>
              <p className="text-indigo-500 text-xl">{searchText}</p>
            </div>
            {!loading ? (
              <>
                {searchedFiles.length ? (
                  <div className="flex flex-row flex-wrap justify-center items-center gap-5 ">
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
        )}
      </div>
    </div>
  );
};

export default Recents;
