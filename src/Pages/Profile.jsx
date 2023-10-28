import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { database, formatter } from "../config/firebase";
import { query, where, onSnapshot } from "firebase/firestore";
import { getCountFromServer } from "firebase/firestore";
// import Navbar from "../components/Navbar";
import { FcFolder, FcFile } from "react-icons/fc";
import { FaToggleOn } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { BsFillShieldSlashFill } from "react-icons/bs";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState([]);
  const [foldersCountState, setFoldersCountState] = useState(null);
  const [filesCountState, setFilesCountState] = useState(null);
  console.log(profile);

  const { currentUser } = useAuthContext();

  const totalFoldersCount = async () => {
    const totalFolders = await getCountFromServer(
      query(database.folders, where("userId", "==", currentUser.uid))
    );
    console.log(totalFolders);
    setFoldersCountState(totalFolders.data());
  };

  const q = query(database.users, where("userId", "==", currentUser.uid));

  const getProfile = () => {
    onSnapshot(q, (snapshot) => {
      const userProfile = snapshot.docs.map(formatter.formatDoc)[0];
      // console.log(userProfile);
      setProfile(userProfile);
    });
  };

  // useEffect(() => {
  //   // getting total number of files from the server
  //   totalFoldersCount();
  //   getProfile();
  // }, []);

  return (
    <>
      {/* {Array.isArray(profile) && profile && ( */}
      <div className="m-auto mt-10 w-5/6 h-[65vh] flex flex-col justify-between items-center gap-5">
        {/* <h2 className=" text-5xl font-semibold">Dude, {currentUser?.displayName}</h2> */}
        {/* top details */}
        <div className=" w-[50rem] h-[10rem] lg:w-[60rem] lg:h-[15rem] bg-black flex flex-col md:flex-row items-center gap-2">
          {/* user image */}
          <div className="w-[18rem] lg:w-[20rem] h-full rounded-3xl p-2">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt=""
                className="h-full w-full object-cover rounded-3xl shadow-xl"
              />
            ) : (
              <div className="bg-gradient-to-br from-red-500 to-blue-600 shadow-xl h-full w-full flex justify-center items-center rounded-3xl text-7xl font-semibold">
                {currentUser.displayName[0].toUpperCase()}
              </div>
            )}
          </div>
          {/* specific details */}
          <div className="w-[40rem] h-full flex flex-wrap justify-center items-center gap-2 p-2">
            {/* folders count */}
            <div className="w-[15rem] h-[3rem] bg-slate-50 shadow-xl rounded-2xl m-auto flex justify-evenly items-center p-10 gap-5">
              <FcFolder className="text-6xl" />
              <div>
                <span className="font-bold text-3xl text-blue-600">
                  {foldersCountState?.count} 09
                </span>
                <p className="text-xl font-semibold">Folders</p>
              </div>
            </div>
            {/* files count */}
            <div className="w-[15rem] h-[3rem] bg-slate-50 shadow-xl rounded-2xl m-auto flex justify-evenly items-center p-10 gap-5">
              <FcFile className="text-6xl" />
              <div>
                <span className="font-bold text-3xl text-blue-600">129</span>
                <p className="text-xl font-semibold">Files</p>
              </div>
            </div>
            {/* email varified check */}
            <div className="w-[15rem] h-[3rem] bg-slate-50 shadow-xl rounded-2xl m-auto flex justify-evenly items-center p-10 gap-5">
              {currentUser.emailVerified ? (
                <MdVerifiedUser className="text-6xl text-emerald-500" />
              ) : (
                <BsFillShieldSlashFill className="text-6xl text-emerald-500" />
              )}
              <div>
                <p className="text-xl font-semibold">Varified</p>
                <p className="text-xl font-semibold">Email</p>
              </div>
            </div>
            {/* dark mode check */}
            <div className="w-[15rem] h-[3rem] bg-slate-50 shadow-xl rounded-2xl m-auto flex justify-evenly items-center p-10 gap-5">
              <FaToggleOn className="text-6xl text-blue-600" />
              <div>
                <p className="text-xl font-semibold">Dark</p>
                <p className="text-xl font-semibold">Mode</p>
              </div>
            </div>
          </div>
        </div>
        {/* bottom details */}
        <div className="w-[60rem] h-[18rem] rounded-xl flex flex-col md:flex-wrap justify-center items-center gap-2">
          {/* full name details */}
          <div className="w-[29rem] h-[6.5rem] bg-slate-50 shadow-xl rounded-2xl m-auto flex flex-col justify-center items-start p-10">
            <span className="font-bold text-xl ">Full name:</span>
            <p className="text-xl font-semibold text-blue-600">
              {profile.fullName}
            </p>
          </div>
          {/* DOB details */}
          <div className="w-[29rem] h-[6.5rem] bg-slate-50 shadow-xl rounded-2xl m-auto flex flex-col justify-center items-start p-10">
            <span className="font-bold text-xl ">Date of birth:</span>
            <p className="text-xl font-semibold text-blue-600">{profile.DOB}</p>
          </div>
          {/* email details */}
          <div className="w-[29rem] h-[6.5rem] bg-slate-50 shadow-xl rounded-2xl m-auto flex flex-col justify-center items-start p-10">
            <span className="font-bold text-xl ">Email:</span>
            <p className="text-xl font-semibold text-blue-600">
              {profile.email}
            </p>
          </div>
          {/* update profile option */}
          <div className="w-[29rem] h-[6.5rem] bg-slate-50 shadow-xl rounded-2xl m-auto flex  justify-start items-center p-10">
            <span className="font-bold text-base text-slate-600 ">Want to update profile:</span>
            <Link to={"/updateProfile"} className="w-32 ml-5 text-[17px] rounded-xl font-semibold text-white bg-blue-600 p-2 cursor-pointer hover:bg-blue-700 duration-300">
              Update
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
