import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { database, formatter } from "../config/firebase";
import { query, where, onSnapshot } from "firebase/firestore";
import { getCountFromServer } from "firebase/firestore";
import Navbar from "../components/Navbar";

import UpdateProfile from "../components/UpdateProfile";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const { currentUser } = useAuthContext();

  // // getting total number of files from the server
  // const totalFoldersCount = async () => {
  //   const totalFolders = await getCountFromServer(
  //     query(database.folders, where("userId", "==", currentUser.uid))
  //   );
  //   console.log(totalFolders);
  // };

  // useEffect(() => {
  //   const q = query(database.users, where("userId", "==", currentUser.uid));

  //   onSnapshot(q, (snapshot) => {
  //     const userProfile = snapshot.docs.map(formatter.formatDoc)[0];
  //     // console.log(userProfile);
  //     setProfile(userProfile);
  //   });
  // }, []);

  return (
    <>
      <div className=" ml-20 text-center bg-[#E2EFFF] min-h-screen p-6 lg:px-8">
        <Navbar />
        <div className="w-full h-full">
          <div className="max-w-5xl py-3 grid-container " id="container">
            {/* <div className="box span-row bg-slate-500 rounded-2xl"> */}
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt=""
                className="span-row rounded-2xl"
              />
            ) : (
              <div className="span-row rounded-2xl text-7xl font-semibold bg-gradient-to-r from-cyan-900 to-blue-900">
                {currentUser.displayName[0].toUpperCase()}
              </div>
            )}

            {/* </div> */}
            <div className="span-row rounded-2xl">
              {/* top right grids */}
              <div className="max-w-5xl h-full bottom-grid-container">
                <div className="box span-col text-5xl font-bold bg-slate-400 rounded-2xl">
                  Dude, RahulDew
                </div>
                <div className="box bg-slate-300 rounded-2xl">Item four</div>
                <div className="box bg-slate-300 rounded-2xl">Item five</div>
                <div className="box bg-slate-300 rounded-2xl">Item four</div>
                <div className="box bg-slate-300 rounded-2xl">Item five</div>
              </div>
            </div>
          </div>
          {/* Bottom Grids */}
          <div className="max-w-5xl bottom-grid-container" id="container">
            <article className="bg-slate-400 w-full h-full rounded-2xl relative">
              <div className="left-0 bottom-0  flex flex-col justify-center items-center">
                <h4>Full Name:</h4>
                <p>Rahul Kumar</p>
              </div>
            </article>
            <article className="box bg-slate-400 rounded-2xl">
              Item five
            </article>
            <article className="box bg-slate-400 rounded-2xl">
              Item four
            </article>
            <article className="box bg-slate-400 rounded-2xl">
              Item five
            </article>
          </div>
        </div>
        {/* <UpdateProfile currentUser={currentUser} /> */}
      </div>
    </>
  );
};

export default Profile;

{
  /* <h1 classNameName="text-2xl ">Profile</h1>
        <div>
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} className="w-32 h-32" />
          ) : (
            <div className="w-24 h-24 flex justify-center items-center rounded-full p-3 bg-slate-800 text-white">
              <div className="text-3xl font-semibold">
                {currentUser.displayName[0]}
              </div>
            </div>
          )}
        </div>
        <p>Email: {currentUser.email}</p>
        <p>Email: {currentUser.displayName}</p>
        <p>reloadUserInfoScreenName: {currentUser.reloadUserInfo.screenName}</p>
        <p>reloadUserInfoScreenName: {currentUser.photoURL}</p>
        <p>emailVerified: {currentUser.emailVerified ? "True" : "False"}</p>
        <p>isAnonymous: {currentUser.isAnonymous ? "True" : "False"}</p>
        <p>
          phoneNumber:{" "}
          {currentUser.phoneNumber ? currentUser.phoneNumber : "Null"}
        </p>

        <p>userId: {currentUser.uid}</p>

        <hr className=" border w-4/5 border-blue-600 my-5" />

        form handling */
}
