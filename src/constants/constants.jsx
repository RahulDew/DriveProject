import * as yup from "yup";

import { IoIosTimer } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import {
  FcDocument,
  FcClapperboard,
  FcGallery,
  FcContacts,
  FcMusic,
  FcRules,
  FcFile,
} from "react-icons/fc";

// creating schema using yup library for validation
const SIGNUP_SCHEMA = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email")
    .required("Required!")
    .max(50, "Must be not greater then 50 characters!"),
  password: yup
    .string()
    .required("Required!")
    .min(12, "Must contain atleast 12 characters!")
    .max(100, "Maximum of 100 characters!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,49}$/,
      "Must contain 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number"
    ),
  confirmPassword: yup
    .string()
    .required("Required!")
    // .min(8, "Must be atleast 8 characters!")
    .oneOf([yup.ref("password")], "Please Enter same password!!!"),
});
const LOGIN_SCHEMA = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email")
    .required("Required!")
    .max(50, "Must be not greater then 50 characters!"),
  password: yup
    .string()
    .required("Required!")
    .nonNullable("Please enter your password"),
});
const FORGET_PASSWORD_SCHEMA = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email")
    .required("Required!")
    .max(50, "Must be not greater then 50 characters!"),
});

// initial values for all fields for authentication form
const INITIAL_SIGNUP_VALUES = {
  email: "",
  password: "",
  confirmPassword: "",
};
const INITIAL_LOGIN_VALUES = {
  email: "",
  password: "",
};
const INITIAL_FORGET_PASSWORD_VALUES = {
  email: "",
};

// initial values AND schema for fileSearch form
const FILE_SEARCH_SCHEMA = yup.object().shape({
  fileName: yup
    .string()
    .max(20, "File name not greater then 20 characters!")
    .min(2, "File name should have atleast 3 characters!")
    .trim("Enter name of your file!")
    .nonNullable("Enter name of your file!"),
});
const INITIAL_FILE_SEARCH_VALUES = {
  fileName: "",
};

// initial values AND schema for FolderSearch form
const FOLDER_SEARCH_SCHEMA = yup.object().shape({
  folderName: yup
    .string()
    .max(20, "Folder name not greater then 20 characters!")
    .min(2, "Folder name should have atleast 3 characters!")
    .trim("Enter name of your folder!")
    .nonNullable("Enter name of your folder!"),
});
const INITIAL_FOLDER_SEARCH_VALUES = {
  folderName: "",
};

// initial values AND schema for all fields in updateProfile form
const PROFILE_SCHEMA = yup.object().shape({
  username: yup
    .string()
    .required("Required!")
    .max(15, "Must be not greater then 15 characters!")
    .min(5, "Must be atleast 5 characters")
    .trim()
    .nonNullable(),
  fullName: yup
    .string()
    .required("Required!")
    .max(50, "Must be not greater then 50 characters!")
    .min(3, "Must be atleast 3 characters")
    .trim()
    .nonNullable(),
  DOB: yup.date().required("Required!"),
  profileImageFile: yup.mixed().nullable(),
});
const INITIAL_PROFILE_VALUES = {
  username: "",
  fullName: "",
  DOB: "",
  profileImageFile: null,
};


// array of object constants
const NAV_LINKS = [
  { url: `/`, text: "All", icon: <AiOutlineHome /> },
  { url: "/search", text: "Search", icon: <BiSearchAlt2 /> },
  { url: "/recents", text: "Recents", icon: <IoIosTimer /> },
  { url: "/profile", text: "Profile", icon: <FaRegUser /> },
];
const ICONS_DICTIONARY = [
  {
    type: "image",
    icon: <FcGallery />,
    preview: "image",
  },
  {
    type: "video",
    icon: <FcClapperboard />,
    preview: "video",
  },
  {
    type: "audio",
    icon: <FcMusic />,
    preview: "song",
  },
  {
    type: "application",
    icon: <FcDocument />,
    preview: "docments",
  },
  {
    type: "text",
    icon: <FcRules />,
    preview: "text/html",
  },
  {
    type: "file/data",
    icon: <FcContacts />,
    preview: "text/html",
  },
];
const RECENT_FILES_TIME_STAMPS = [
  { text: "5", time: 5 },
  { text: "10", time: 10 },
  { text: "15", time: 15 },
  { text: "25", time: 25 },
  { text: "30", time: 30 },
];

export {
  SIGNUP_SCHEMA,
  INITIAL_SIGNUP_VALUES,
  LOGIN_SCHEMA,
  INITIAL_LOGIN_VALUES,
  FORGET_PASSWORD_SCHEMA,
  INITIAL_FORGET_PASSWORD_VALUES,
  FILE_SEARCH_SCHEMA,
  INITIAL_FILE_SEARCH_VALUES,
  FOLDER_SEARCH_SCHEMA,
  INITIAL_FOLDER_SEARCH_VALUES,
  PROFILE_SCHEMA,
  INITIAL_PROFILE_VALUES,
  NAV_LINKS,
  ICONS_DICTIONARY,
  RECENT_FILES_TIME_STAMPS,
};
