import React, { useContext, useEffect, useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const { api, setLogin, setUserData } = useContext(UserContext);
  const [state, setState] = useState("signup");
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onhandleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (state == "signup") {
        response = await api.post("/api/register", {
          name,
          email,
          password,
        });

        if (response.data.success) {
          setState("login");
          toast.success("User Has Registered Successfully !");
          navigate("/login");
        }
      } else {
        response = await api.post("/api/login", {
          email,
          password,
        });
        if (response.data.success) {
          setLogin(true);
          setUserData(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("isLoggedIn", "true");
          toast.success(response.data.message || "User Login Successfully");
          navigate("/");
        }
      }
    } catch (err) {
      console.log("Somthing Went Wrong", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center  bg-white dark:bg-gray-800 ">
      <div className="border-white border-2 rounded-2xl p-3.5 bg-[#4f7c70] flex flex-col items-center min-w-4/6 sm:min-w-min sm:w-96">
        {state == "signup" ? (
          <div className=" text-2xl font-bold  text-white  ">
            {" "}
            Create Account{" "}
          </div>
        ) : (
          <div className=" text-2xl font-bold  text-white  "> Login </div>
        )}

        {state ? (
          <h3 className=" text-blue-500 text-center mt-2 mb-1">
            Create your account
          </h3>
        ) : (
          <h3 className=" text-blue-500 text-center mt-2 mb-1">
            Login your account
          </h3>
        )}
        <form onSubmit={onhandleSubmit} className="w-full">
          {state == "signup" && (
            <div className=" flex w-full   gap-1 my-3  p-3 rounded-2xl dark:bg-gray-800 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>

              <input
                type="text"
                value={name}
                required
                onChange={(e) => setname(e.target.value)}
                placeholder="Enter Full Name"
                className="text-white outline-0"
              />
            </div>
          )}
          <div className=" flex w-full   gap-1 my-3   p-3 rounded-2xl dark:bg-gray-800 focus:">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>

            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="text-white outline-0"
            />
          </div>
          <div className=" flex w-full   gap-1 my-3  p-3 rounded-2xl dark:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Password"
              className="text-white outline-0"
            />
          </div>

          {state == "login" && (
            <Link
              to={"/RestPassword"}
              className="mb-2 text-blue-500 font-medium "
            >
              Forgot Password?
            </Link>
          )}
          <button
            type="submit"
            className="font-bold cursor-pointer text-shadow-amber-200 px-4 w-full bg-green-300 text-white  py-2 rounded-full"
          >
            {state}
          </button>
        </form>
        {state == "signup" ? (
          <div className="flex  gap-1 mt-1.5">
            <p className="text-white text-sm">Already have an account?</p>{" "}
            <span
              onClick={() => setState("login")}
              className="text-blue-500 underline font-bold cursor-pointer"
            >
              Login here
            </span>
          </div>
        ) : (
          <div className="flex  gap-1 mt-1.5">
            <p className="text-white text-sm">Don't have an account?</p>{" "}
            <span
              onClick={() => setState("signup")}
              className="text-blue-500 underline font-bold cursor-pointer"
            >
              SingUp
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
