import React, { useContext } from "react";
import logo from "../assets/logo.png";
import { data, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const Header = () => {
  const {  setLogin, api, userData, setUserData } =
    useContext(UserContext);
  const navigate = useNavigate();

  const logOutHandler = async () => {
    try {
      let response = await api.post("/api/logout");
      if (response.data?.success) {
        setLogin(false);
        setUserData(false);
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        toast.success(response.data.message || "User Logout Successfully");
        navigate("/");
      } else {
        console.log("logoutFailed");
        toast.error(response.data?.message || "Logout failed");
      }
    } catch (error) {
      console.log("Some Error Occure", error);
      toast.error(error.response?.data?.message || "Network error occurred");
    }
  };

  const verifyEmailHandler = async () => {
      if (!userData) {
    toast.error("Please login again");
    navigate("/login");
    return;
  }
    try {
      let response = await api.post("/api/sentOTP");
      if (response.data.success) {
        toast.success("OTP sented successfully !");
        navigate("/verifyEmail");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.log("Some Error Occure", error);
      toast.error(error.response?.data?.message || "Network error occurred");
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 absolute top-0 left-0 right-0 lg:px-10 lg:py-4 xl:px-24 xl:py-8">
      <div>
        <img src={logo} className="w-25" alt="" />
      </div>
      {userData ? (
        <button className=" flex items-center w-10  h-10 justify-center font-bold p-1 text-white border-white bg-green-400 rounded-full capitalize relative group">
          {userData?.name?.[0]}
          <div className="absolute hidden group-hover:block top-0 right-0 pt-12 z-12">
            <ul className=" bg-[#aab2aa] font-bold text-black text-sm p-4 text-left">
              {!userData.isVerifyedUSer&&(<Link to={"/verifyEmail"} onClick={verifyEmailHandler}>
                emailVerify
              </Link>)}
              <li onClick={logOutHandler}>logout</li>
            </ul>
          </div>
        </button>
      ) : (
        <Link to={"/login"} className="btn flex mt-0 gap-1">
          Login
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default Header;
