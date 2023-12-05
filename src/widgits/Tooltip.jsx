import React from "react";
import { motion } from "framer-motion";
const Tooltip = ({ message, children }) => {
  return (
    <div className="group relative flex justify-center items-center">
      {children}
      <span className="absolute top-12 scale-0 rounded-lg shadow-md bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white group-hover:scale-100">
        {message}
      </span>
    </div>
  );
};

export default Tooltip;
