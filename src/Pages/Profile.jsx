import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { database, formatter } from "../config/firebase";
import { query, where, onSnapshot } from "firebase/firestore";
import { getCountFromServer } from "firebase/firestore";
import { FcFolder, FcFile } from "react-icons/fc";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { BsFillShieldSlashFill } from "react-icons/bs";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import { pageTitle } from "../utils";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [itemsCount, setItemsCount] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const { currentUser, darkMode, handleToggleDarkMode } = useAuthContext();

  pageTitle("Profile | Stasher");

  const totalFilesFoldersCount = async () => {
    // getting info about totalFolderCount
    const totalFolders = await getCountFromServer(
      query(database.folders, where("userId", "==", currentUser.uid))
    );

    // getting info about totalFolderCount
    const totalFiles = await getCountFromServer(
      query(database.files, where("userId", "==", currentUser.uid))
    );
    // console.log("totalFolders:", totalFolders);
    // console.log("totalFiles:", totalFiles);
    setItemsCount({
      foldersCount: totalFolders.data(),
      filesCount: totalFiles.data(),
    });
    // setFoldersCountState(totalFolders.data());
  };

  const profileQuery = query(
    database.users,
    where("userId", "==", currentUser.uid)
  );

  const getProfile = () => {
    setIsProfileLoading(true);
    onSnapshot(profileQuery, (snapshot) => {
      const userProfile = snapshot.docs.map(formatter.formatDoc);
      // console.log(userProfile);
      if (Array.isArray(userProfile) && userProfile.length) {
        setProfile(userProfile[0]);
      } else {
        setProfile(null);
      }
      setIsProfileLoading(false);
    });
  };

  useEffect(() => {
    // getting total numbers of folders and total numbers of files from the server
    totalFilesFoldersCount();
    // getting the profile document of the currentUser
    getProfile();
  }, []);

  return (
    <>
      {isProfileLoading ? (
        <div className="my-80 sm:my-72 h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0.5, y: "-1vw" }}
          animate={{ opacity: 1, y: 0 }}
          className="m-auto lg:mt-14 w-full md:w-5/6 lg:w-11/12 h-full lg:h-[65vh] flex flex-col justify-between items-center gap-3 text-slate-800 dark:text-slate-100"
        >
          {/* top details */}
          <div className="w-full h-full lg:w-[55rem] xl:w-[68rem] lg:h-[15rem] xl:h-[15rem] flex flex-col lg:flex-row justify-center items-center gap-2">
            {/* user image */}
            <div className="w-[15rem] sm:w-[25rem] md:w-[30rem] lg:w-[20rem] xl:w-[22rem] h-60 lg:h-full rounded-3xl p-2">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt=""
                  className="h-full w-full object-cover rounded-3xl shadow-xl dark:shadow-none focus:shadow-blue-300 md:hover:shadow-blue-300 duration-200 bg-slate-50 dark:bg-slate-800 "
                />
              ) : (
                <div className="select-none bg-gradient-to-tl text-slate-50 from-slate-900 to-blue-700 h-full w-full flex justify-center items-center text-8xl lg:text-9xl font-semibold rounded-3xl shadow-xl dark:shadow-none focus:shadow-blue-300 md:hover:shadow-blue-300 duration-200">
                  {currentUser.displayName
                    ? currentUser.displayName[0].toUpperCase()
                    : currentUser.email[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* specific details */}
            <div className="w-full lg:w-[38rem] xl:w-[38rem]  h-full flex flex-wrap justify-center items-center gap-3 p-2">
              <div className="w-full flex justify-center items-center gap-3">
                {/* folders count */}
                <div className="w-full lg:w-[16rem] xl:w-[18rem] h-[6rem] xl:h-[6.5rem] bg-slate-50 dark:bg-slate-800 shadow-xl dark:shadow-none duration-200 rounded-2xl m-auto flex justify-evenly items-center p-2 lg:p-10 gap-2 sm:gap-5 ">
                  <FcFolder className="text-5xl sm:text-6xl" />
                  <div>
                    <span className="font-bold text-xl sm:text-3xl text-blue-600">
                      {itemsCount?.foldersCount
                        ? itemsCount?.foldersCount.count
                        : "..."}
                    </span>
                    <p className="text-xl font-semibold">Folders</p>
                  </div>
                </div>
                {/* files count */}
                <div className="w-full lg:w-[16rem] xl:w-[18rem] h-[6rem] xl:h-[6.5rem] bg-slate-50 dark:bg-slate-800 shadow-xl dark:shadow-none duration-200  rounded-2xl m-auto flex justify-evenly items-center p-2 lg:p-10 gap-2 sm:gap-5">
                  <FcFile className="text-5xl sm:text-6xl" />
                  <div>
                    <span className="font-bold text-xl sm:text-3xl text-blue-600">
                      {itemsCount?.filesCount
                        ? itemsCount?.filesCount.count
                        : "..."}
                    </span>
                    <p className="text-xl font-semibold">Files</p>
                  </div>
                </div>
              </div>
              {/* options */}
              <div className="w-full flex justify-center items-center gap-3">
                {/* email varified check */}
                <Link
                  to={"/verifyEmail"}
                  className="w-full lg:w-[16rem] xl:w-[18rem] h-[6rem] xl:h-[6.5rem] bg-slate-50 dark:bg-slate-800 shadow-xl dark:shadow-none focus:shadow-blue-300 md:hover:shadow-blue-300 duration-200 rounded-2xl m-auto flex justify-evenly items-center p-2 lg:p-10 gap-2 sm:gap-5"
                >
                  {currentUser?.emailVerified ? (
                    <MdVerifiedUser className="text-5xl sm:text-6xl text-emerald-500" />
                  ) : (
                    <BsFillShieldSlashFill className="text-5xl sm:text-6xl text-red-500" />
                  )}
                  <div>
                    <p className="text-xl font-semibold">Varified</p>
                    <p className="text-xl font-semibold">Email</p>
                  </div>
                </Link>
                {/* dark mode check */}
                <div
                  onClick={handleToggleDarkMode}
                  className="cursor-pointer w-full lg:w-[16rem] xl:w-[18rem] h-[6rem] xl:h-[6.5rem] bg-slate-50 dark:bg-slate-800 shadow-xl dark:shadow-none focus:shadow-blue-300 md:hover:shadow-blue-300 duration-200 rounded-2xl m-auto flex justify-evenly items-center p-2 lg:p-10 gap-2 sm:gap-5"
                >
                  {darkMode ? (
                    <FaToggleOn className="text-5xl sm:text-6xl text-blue-600" />
                  ) : (
                    <FaToggleOff className="text-5xl sm:text-6xl text-slate-900" />
                  )}
                  <div>
                    <p className="text-xl font-semibold">Dark</p>
                    <p className="text-xl font-semibold">Mode</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* bottom details */}
          <div className="w-full h-full lg:w-[55rem] xl:w-[68rem] lg:h-[15rem] rounded-xl flex flex-col lg:flex-wrap justify-center items-center gap-3 xl:gap-5 xl:px-16">
            {/* full name details */}
            <div className="w-full lg:w-[26rem] xl:w-[29rem] h-[6.5rem] bg-slate-50 dark:bg-slate-800 shadow-xl dark:shadow-none duration-200 rounded-2xl  flex flex-col justify-center items-start pl-4 sm:p-10">
              <span className="font-semibold sm:font-bold text-xl ">
                Full name:
              </span>
              <p className="text-xl font-semibold text-blue-600">
                {profile?.fullName}
              </p>
            </div>
            {/* DOB details */}
            <div className="w-full lg:w-[26rem] xl:w-[29rem] h-[6.5rem] bg-slate-50 dark:bg-slate-800 shadow-xl dark:shadow-none duration-200 rounded-2xl  flex flex-col justify-center items-start pl-4 sm:p-10">
              <span className="font-semibold sm:font-bold text-xl ">
                Date of birth:
              </span>
              <p className="text-xl font-semibold text-blue-600">
                {profile?.DOB}
              </p>
            </div>
            {/* email details */}
            <div className="w-full lg:w-[26rem] xl:w-[29rem] h-[6.5rem] bg-slate-50 dark:bg-slate-800 shadow-xl dark:shadow-none duration-200 rounded-2xl  flex flex-col justify-center items-start pl-4 sm:p-10">
              <span className="font-semibold sm:font-bold text-xl ">
                Email:
              </span>
              <p className="text-xl font-semibold text-blue-600">
                {profile?.email}
              </p>
            </div>
            {/* update profile option */}
            <div className="w-full lg:w-[26rem] xl:w-[29rem] h-[6.5rem] bg-slate-50 dark:bg-slate-800 shadow-xl dark:shadow-none duration-200 rounded-2xl  flex  justify-between items-center p-4 sm:p-10">
              <span className="font-semibold sm:font-bold text-base">
                Want to update profile:
              </span>
              <Link
                to={"/updateProfile"}
                className="w-32 ml-5 text-[17px] rounded-xl font-semibold text-white bg-blue-600 p-2 cursor-pointer hover:bg-blue-700 duration-300"
              >
                Update
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Profile;
