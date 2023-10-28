import React from "react";
import { MdClose, MdOutlineCancel } from "react-icons/md";
import { motion } from "framer-motion";
import { TiWarningOutline } from "react-icons/ti";
import { BsCheck2Circle } from "react-icons/bs";

const Toast = ({ toast, removeToast }) => {
  const ToastIcons = [
    {
      type: "success",
      icon: <BsCheck2Circle />,
      color: "blue",
    },
    {
      type: "warning",
      icon: <TiWarningOutline />,
      color: "yellow",
    },
    {
      type: "failure",
      icon: <MdOutlineCancel />,
      color: "red",
    },
  ];

  // const toastIcon = ToastIcons.map((toastIcon) => {
  //   if (toastIcon.type === toast.type) {
  //     return toastIcon.icon;
  //   }
  // });

  let toastIcon = null;
  let toastIconColor = null;

  ToastIcons.map((ToastIcon) => {
    if (ToastIcon.type === toast.type) {
      toastIconColor = ToastIcon.color;
      toastIcon = ToastIcon.icon;
    }
  });

  // console.log(toastIconColor);
  // console.log(toastIcon);

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0.2 }}
      animate={{ scale: 1, opacity: 1 }}
      className="z-10 w-64 md:w-72 lg:w-96 flex items-center p-2 text-slate-500 bg-white rounded-xl shadow-lg dark:text-gray-400 dark:bg-slate-900 "
    >
      <div
        className={`text-xl inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-${toastIconColor}-500 bg-${toastIconColor}-100 rounded-lg dark:text-${toastIconColor}-300  dark:bg-${toastIconColor}-900 dark:bg-opacity-50`}
      >
        {toastIcon}
        {/* <span className="sr-only">Fire icon</span> */}
      </div>
      <div className="ml-3 text-sm font-normal">{toast.message}</div>
      <button
        onClick={() => removeToast(toast.id)}
        type="button"
        className="ml-auto text-xl text-gray-400 hover:text-slate-700 rounded-lg p-1.5 hover:bg-slate-200 outline-none inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:hover:bg-slate-800"
      >
        <MdClose />
      </button>
    </motion.div>
  );
};

export default Toast;
