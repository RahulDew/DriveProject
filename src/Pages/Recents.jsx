import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import File from "../components/File";
import { database } from "../config/firebase";
import { formatter } from "../config/firebase";
import { useAuthContext } from "../context/AuthContext";
import { query, where, onSnapshot } from "firebase/firestore";
import Loader from "../components/Loader";

const recentFilesTimestamp = [
  { text: "5 days ago", time: 400000000 },
  { text: "10 days ago", time: 900000000 },
  { text: "15 days ago", time: 1400000000 },
  { text: "25 days ago", time: 2400000000 },
  { text: "30 days ago", time: 2900000000 },
];

const Recents = () => {
  const [recentFiles, setRecentFiles] = useState(null);

  // recently added files within 10 days
  const [recentFileTime, setrecentFileTime] = useState(400000000);
  const [loading, setLoading] = useState(false); // forcefully set to true

  //getting current user and setAllFiles States
  const { currentUser, setAllFiles, allFiles } = useAuthContext();

  const q = query(database.files, where("userId", "==", currentUser.uid));

  useEffect(() => {
    setLoading(true);
    // console.log("bhai loding set kr diya");
    onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map(formatter.formatDoc);
      setAllFiles(files);
      // console.log("Bhai Sare files: ", files);

      const recentlyAddedFiles = files.filter((file) => {
        if (new Date() - file.createdAt.toDate() <= recentFileTime) {
          // console.log(new Date() - file.createdAt.toDate());
          // console.log(file);
          return file;
        }
      });
      setRecentFiles(recentlyAddedFiles);
      setLoading(false);
      // console.log("bhai loding hta diya");
      // console.log("Recents files: ", recentlyAddedFiles);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const recentlyFiles = allFiles.filter((file) => {
      if (new Date() - file.createdAt.toDate() <= recentFileTime) {
        return file;
      }
    });
    // console.log(recentlyFiles);
    setRecentFiles(recentlyFiles);
    setLoading(false);
  }, [recentFileTime]);

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
    <div className=" ml-20 text-center bg-[#E2EFFF] min-h-screen p-6 lg:px-8">
      <Navbar />
      <div className="px-5">
        <hr className="font-bold border-slate-300 my-8" />

        <div className="my-5 flex justify-between">
          <h2 className="text-2xl font-semibold">Recent Files:</h2>
          <div>
            <select
              className="py-2 px-3 rounded-md outline-none bg-slate-400 bg-opacity-25"
              onChange={(e) => setrecentFileTime(e.target.value)}
            >
              {recentFilesTimestamp.map((timestamp, index) => (
                <option
                  key={index}
                  value={timestamp.time}
                  className="cursor-pointer mt-5"
                  onClick={() => setrecentFileTime(timestamp.time)}
                >
                  {timestamp.text}
                </option>
              ))}
            </select>
          </div>
          {/* <h1>{recentFileTime}</h1> */}
        </div>
        {!loading ? (
          <>
            {Array.isArray(recentFiles) && recentFiles.length ? (
              <div className="flex flex-row flex-wrap justify-center items-center gap-8 ">
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
              <>
                {Array.isArray(recentFiles) && !recentFiles.length ? (
                  <div className="flex items-center justify-center ">
                    <Loader />
                  </div>
                ) : (
                  <h2 className="text-center">No Recent Files Available🪹</h2>
                )}
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center ">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Recents;
