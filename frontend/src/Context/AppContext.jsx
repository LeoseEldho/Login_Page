import React, { createContext, useState,useEffect } from "react";
import axios from 'axios'

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState(null)

useEffect(() => {
  const savedUser = localStorage.getItem("user");

  if (savedUser && savedUser !== "undefined") {
    try {
      setUserData(JSON.parse(savedUser));
      setLogin(true);
    } catch (err) {
      console.error("Invalid user in localStorage", err);
      localStorage.removeItem("user");
    }
  }
}, []);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const api = axios.create({
  baseURL:backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

  return (
    <UserContext.Provider value={{backendUrl,api,login,setLogin ,userData,setUserData}}>{children}</UserContext.Provider>
  );
};
