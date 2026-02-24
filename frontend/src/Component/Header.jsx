import React, { useContext, useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const Header = () => {
  const { setLogin, api, userData, setUserData } =
    useContext(UserContext);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logOutHandler = async () => {
    try {
      const response = await api.post("/api/logout");
      if (response.data?.success) {
        setLogin(false);
        setUserData(false);
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        toast.success(response.data.message || "User Logout Successfully");
        navigate("/");
      } else {
        toast.error(response.data?.message || "Logout failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Network error occurred");
    }
  };

  const verifyEmailHandler = async () => {
    try {
      const response = await api.post("/api/sentOTP");
      if (response.data.success) {
        toast.success("OTP sent successfully!");
        navigate("/verifyEmail");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Network error occurred");
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 absolute top-0 left-0 right-0 lg:px-10 lg:py-4 xl:px-24 xl:py-8">
      <img src={logo} className="w-25" alt="logo" />

      {userData ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center w-10 h-10 justify-center font-bold
                       text-white bg-green-400 rounded-full capitalize"
          >
            {userData?.name?.[0]}
          </button>

          {open && (
            <ul
              className="absolute right-0 mt-2 bg-[#aab2aa] font-bold
                           text-black text-sm p-4 rounded shadow z-50"
            >
              {!userData.isVerifyedUSer && (
                <li className="mb-2 whitespace-nowrap">
                  <Link to="/verifyEmail" onClick={verifyEmailHandler}>
                    Email Verify
                  </Link>
                </li>
              )}
              <li onClick={logOutHandler} className="cursor-pointer">
                Logout
              </li>
            </ul>
          )}
        </div>
      ) : (
        <Link to="/login" className="btn flex mt-0 gap-1">
          Login
        </Link>
      )}
    </div>
  );
};

export default Header;
