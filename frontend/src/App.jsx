import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Page/Home";
import React from "react";
import Login from "./Page/Login";
import RestPassword from "./Page/RestPassword";
import { UserContextProvider } from "./Context/AppContext";
import VerifyEmail from "./Page/VerifyEmail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <UserContextProvider>
        <ToastContainer/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/RestPassword" element={<RestPassword />} />
          <Route path="/verifyEmail" element={<VerifyEmail />}></Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
