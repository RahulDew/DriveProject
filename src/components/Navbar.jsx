import React from "react";

const Navbar = ({ handleLogout }) => {
  return (
    <nav
      className="flex items-center justify-between"
      aria-label="Global"
    >
      <div className="flex lg:flex-1">
        <a href="/" className="flex gap-3  -m-1.5 p-1.5">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt=""
          />
          <span className="font-bold text-2xl">Personal Drive</span>
        </a>
      </div>
      <div className="flex">
        <button
          onClick={handleLogout}
          className="text-sm font-semibold leading-6 text-white bg-indigo-500 p-2 rounded-md"
        >
          Log out <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
