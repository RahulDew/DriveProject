import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import File from "../components/File";

import { useAuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import { FcFile, FcVideoFile, FcAudioFile, FcImageFile } from "react-icons/fc";
import { motion } from "framer-motion";
import { query, where, onSnapshot } from "firebase/firestore";
import { database } from "../config/firebase";
import { formatter } from "../config/firebase";
import { pageTitle } from "../utils";
import { RECENT_FILES_TIME_STAMPS } from "../constants/constants";

// const RECENT_FILES_TIME_STAMPS = [
//   { text: "5", time: 5 },
//   { text: "10", time: 10 },
//   { text: "15", time: 15 },
//   { text: "25", time: 25 },
//   { text: "30", time: 30 },
// ];

const Recents = () => {
  const [recentFiles, setRecentFiles] = useState(null);

  // recently added files within default 5 days
  const [recentFilesTime, setRecentFilesTime] = useState(5);

  // console.log(recentFiles);

  //getting allFiles State
  const { currentUser } = useAuthContext();

  pageTitle("Recents | Stasher");

  const currentDate = new Date(); //getting the current date
  // console.log(currentDate);
  currentDate.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds to start of the day
  // console.log(currentDate);
  const daysAgo = new Date(currentDate);
  // console.log(daysAgo);
  daysAgo.setDate(daysAgo.getDate() - recentFilesTime);
  // console.log(daysAgo);

  const searchRecentFilesQ = query(
    database.files,
    where("userId", "==", currentUser.uid),
    where("createdAt", ">=", daysAgo)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(searchRecentFilesQ, (snapshot) => {
      const files = snapshot.docs.map(formatter.formatDoc);
      // console.log(files);
      if (files.length) {
      }
      setRecentFiles(files);
    });

    return unsubscribe;
  }, [recentFilesTime]);

  return (
    <div className="sm:px-5 h-full">
      {/* timestamp filter container */}
      <div className="flex flex-col justify-center items-center gap-5 my-14 ">
        <h3 className="text-4xl font-bold">Recents Files</h3>
        <p className="text-xl font-light text-slate-500">
          Use Filter to find files which uploaded recently
        </p>
        {/* timestamp filter */}
        <div>
          <div className="w-full sm:w-5/6 md:w-[39rem] flex gap-1.5 items-center justify-between bg-slate-50 dark:bg-slate-900 shadow-xl hover:shadow-blue-200 dark:shadow-none rounded-full p-2 md:p-3 text-xs md:text-[17px] font-semibold duration-300">
            {RECENT_FILES_TIME_STAMPS.map((timeStamp, index) => (
              <div
                key={index}
                onClick={() => setRecentFilesTime(timeStamp.time)}
                className={`${
                  recentFilesTime == timeStamp.time
                    ? "bg-blue-600 text-white cursor-default"
                    : "bg-slate-200 hover:bg-blue-100 dark:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-600 dark:hover:bg-blue-950 cursor-pointer "
                } md:p-2.5 p-3 rounded-full duration-300 flex justify-center items-center gap-1 w-10 h-10 sm:w-full sm:h-full`}
              >
                <span>{timeStamp.text}</span>
                <p className="hidden sm:block">days ago</p>
              </div>
            ))}
          </div>
          <p className="visible sm:hidden mt-2 font-semibold">Days Ago</p>
        </div>
      </div>

      <hr className="font-bold border-slate-300 dark:border-slate-800 my-8 duration-200" />

      {Array.isArray(recentFiles) && recentFiles.length ? (
        <div className="flex flex-row flex-wrap justify-center items-center gap-8 ">
          {recentFiles
            .map((file) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={file.id}
              >
                <File file={file} />
              </motion.div>
            ))
            .reverse()}
        </div>
      ) : (
        <>
          {Array.isArray(recentFiles) ? (
            <div className="mt-24">
              <h3 className="text-2xl font-light">
                You haven't uploaded any file in previous
                {RECENT_FILES_TIME_STAMPS.map(
                  (timeStamp, index) =>
                    timeStamp.time == recentFilesTime && (
                      <span
                        key={index}
                        className="text-blue-600 mx-2 font-semibold"
                      >
                        {timeStamp.text}
                      </span>
                    )
                )}
                days
              </h3>
              <div className="mt-5 flex justify-center items-center gap-3 opacity-40 text-7xl sm:text-8xl md:text-9xl">
                <FcImageFile />
                <FcAudioFile />
                <FcVideoFile />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center ">
              <Loader />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Recents;
