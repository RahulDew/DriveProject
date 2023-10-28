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
import { Timestamp } from "firebase/firestore";

const recentFilesTimeStamps = [
  { text: "5", time: 5 },
  { text: "10", time: 10 },
  { text: "15", time: 15 },
  { text: "25", time: 25 },
  { text: "30", time: 30 },
];

const Recents = () => {
  const [recentFiles, setRecentFiles] = useState(null);

  // recently added files within 5 days
  const [recentFileTime, setRecentFilesTime] = useState(5);

  // console.log(recentFiles);

  //getting allFiles State
  const { currentUser } = useAuthContext();

  // const searchRecentQ = query(
  //   database.files,
  //   where("userId", "==", currentUser.uid),
  //   where("createdAt", ">=", Timestamp.now() - recentFileTime)
  // );

  const currentDate = new Date(); //getting the current date
  // console.log(currentDate);
  currentDate.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds to start of the day
  // console.log(currentDate);
  const daysAgo = new Date(currentDate);
  // console.log(daysAgo);
  daysAgo.setDate(daysAgo.getDate() - recentFileTime);
  console.log(daysAgo);

  const searchRecentQ = query(
    database.files,
    where("userId", "==", currentUser.uid),
    where("createdAt", ">=", daysAgo)
  );

  // const currentDate = new Date();

  // console.log("aaj ka date = ", database.currentTimeStamp);
  // console.log("aaj ka date = ", Timestamp.now().seconds );
  // console.log("compare = ", Timestamp.now() - recentFileTime );

  // console.log(Date());
  // var tomorrow = Date();
  // tomorrow.setDate(tomorrow. + 1);
  // const now = new DateTime.now().millisecondsSinceEpoch

  // useEffect(() => {
  //   //   // if (Array.isArray(allFiles) && allFiles.length) {
  //   //   //   const recentlyAddedFiles = allFiles.filter((file) => {
  //   //   //     if (new Date() - file.createdAt.toDate() <= recentFileTime) {
  //   //   //       // // console.log(new Date() - file.createdAt.toDate());
  //   //   //       // console.log( file.createdAt.seconds + "  :  " + recentFileTime);
  //   //   //       // // console.log(file.createdAt > (Timestamp.now().seconds - recentFileTime));
  //   //   //       console.log(
  //   //   //         "direct compare",
  //   //   //         file.createdAt +
  //   //   //           " :  " +
  //   //   //           Timestamp.now() +
  //   //   //           " :  " +
  //   //   //           (Timestamp.now() - recentFileTime)
  //   //   //       );

  //   //   //       return file;
  //   //   //     }
  //   //   //   });

  //   //   //   setRecentFiles(recentlyAddedFiles);
  //   //   //   console.log("bhai recent files set kr diya");
  //   //   // } else {
  //   //   //   return;
  //   //   // }

  //   //   console.log("bhai recent files la rha hu");

  //   const unsubscribe = onSnapshot(searchRecentQ, (snapshot) => {
  //     const files = snapshot.docs.map(formatter.formatDoc);
  //     console.log("Recent files in " + recentFileTime + "days: ");
  //     console.log(files);
  //     if (files.length) {
  //     }
  //     setRecentFiles(files);
  //     // setContentLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(searchRecentQ, (snapshot) => {
      const files = snapshot.docs.map(formatter.formatDoc);
      // console.log("Recent files in " + recentFileTime + "days: ");
      // console.log(files);
      if (files.length) {
      }
      setRecentFiles(files);
    });

    return unsubscribe;
  }, [recentFileTime]);

  // useEffect(() => {
  //   if (Array.isArray(allFiles) && allFiles.length) {
  //     const recentlyAddedFiles = allFiles.filter((file) => {
  //       if (new Date() - file.createdAt.toDate() <= recentFileTime) {
  //         // console.log(new Date() - file.createdAt.toDate());
  //         return file;
  //       }
  //     });

  //     setRecentFiles(recentlyAddedFiles);
  //     console.log("bhai recent files set kr diya");
  //   } else {
  //     return;
  //   }
  // }, [allFiles, recentFileTime]);

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
    <div className="sm:px-5 h-full">
      {/* timestamp filter container */}
      <div className="flex flex-col justify-center items-center gap-5 my-14 ">
        <h3 className="text-4xl font-bold">Recents Files</h3>
        <p className="text-xl font-light text-slate-500">
          Use Filter to find files which uploaded recently
        </p>
        {/* timestamp filter */}
        <div className="w-full sm:w-5/6 md:w-[39rem] flex gap-1.5 items-center justify-between bg-slate-50 dark:bg-slate-900 shadow-xl hover:shadow-blue-200 dark:shadow-none rounded-full p-2 md:p-3 text-xs md:text-[17px] font-semibold duration-300">
          {recentFilesTimeStamps.map((timeStamp, index) => (
            <div
              key={index}
              onClick={() => setRecentFilesTime(timeStamp.time)}
              className={`${
                recentFileTime == timeStamp.time
                  ? "bg-blue-600 text-white cursor-default"
                  : "bg-slate-200 hover:bg-blue-100 dark:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-600 dark:hover:bg-blue-950 cursor-pointer "
              } md:p-2.5 p-3 rounded-full duration-300`}
            >
              {timeStamp.text} days ago
            </div>
          ))}
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
                <p className="text-xs">
                  {/* {file.createdAt.toDate().toDateString()} */}
                </p>
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
                {recentFilesTimeStamps.map(
                  (timeStamp, index) =>
                    timeStamp.time == recentFileTime && (
                      <span key={index} className="text-blue-600 mx-2">
                        {timeStamp.text}
                      </span>
                    )
                )}{" "}
                days
              </h3>
              <div className="mt-5 flex justify-center items-center gap-3 opacity-40">
                <FcImageFile className="text-9xl " />
                <FcAudioFile className="text-9xl " />
                <FcVideoFile className="text-9xl " />
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
