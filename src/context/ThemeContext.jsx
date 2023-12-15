"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const getFromLocalStorage = () => {
  // because first localstorage is client browser side at the begning this app is a server siee component untill it load successfully
  if (typeof window !== "undefined") {
    // cheking if window(browser side is "not undefined")
    const value = localStorage.getItem("theme"); // grab the theme value from the localstorage
    return value || "light"; // if value exist return value or return "light"
  }
};

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return getFromLocalStorage();
  });

  const themeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    localStorage.setItem("theme", theme); // setting the value to localStorage
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
