import React, { useReducer, useEffect } from "react";
import {
  getDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { database, formatter } from "../config/firebase";
import { useAuthContext } from "../context/AuthContext";

const ACTION = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
  SET_CHILD_FOLDERS: "set-child-folder",
  SET_CHILD_FILES: "set-child-files",
};

export const ROOT_FOLDER = { name: "Root", id: null, path: [] };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTION.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFolders: null,
        childFiles: null,
      };
    case ACTION.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder,
      };
    case ACTION.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders,
      };
    case ACTION.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles,
      };
    default:
      return state;
  }
};

export const useFolder = (folderId = null, folder = null) => {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: null,
    childFiles: null,
  });

  const { currentUser } = useAuthContext();

  useEffect(() => {
    dispatch({ type: ACTION.SELECT_FOLDER, payload: { folderId, folder } });
  }, [folderId, folder]);

  useEffect(() => {
    // this condition identify that we have no any folder and it create an ROOT Folder
    if (folderId === null) {
      return dispatch({
        type: ACTION.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      });
    }

    getDoc(doc(database.folders, folderId))
      .then((doc) => {
        dispatch({
          type: ACTION.UPDATE_FOLDER,
          payload: { folder: formatter.formatDoc(doc) },
        });
        // console.log(formatter.formatDoc(doc));
      })
      .catch(() => {
        dispatch({
          type: ACTION.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER },
        });
      });
  }, [folderId]);

  useEffect(() => {
    const q = query(
      database.folders,
      where("parentId", "==", folderId),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt")
    );
    return onSnapshot(q, (snapshot) => {
      dispatch({
        type: ACTION.SET_CHILD_FOLDERS,
        payload: { childFolders: snapshot.docs.map(formatter.formatDoc) },
      });
    });
  }, [folderId, currentUser]);

  useEffect(() => {
    const q = query(
      database.files,
      where("folderId", "==", folderId),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt")
    );
    return onSnapshot(q, (snapshot) => {
      dispatch({
        type: ACTION.SET_CHILD_FILES,
        payload: { childFiles: snapshot.docs.map(formatter.formatDoc) },
      });
    });
  }, [folderId, currentUser]);

  return state;
};
