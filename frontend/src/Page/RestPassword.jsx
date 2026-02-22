import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/AppContext";
import { useState } from "react";
import { toast } from "react-toastify";

const RestPassword = () => {
  const navigate = useNavigate();
  const { api } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [Password,setPassword]=useState("")
  const [enterEmail, setenterEmail] = useState(false);
  const [enterotp, setEnterOtp] = useState(false);

  console.log(Password)
  const otpRef = React.useRef([]);

  const handleInput = (e, ind) => {
    if (e.target.value.length > 0 && ind < otpRef.current.length - 1) {
      otpRef.current[ind + 1].focus();
    }
  };
  const handleKeyDown = (e, ind) => {
    if (e.key == "Backspace" && e.target.value == "" && ind > 0) {
      otpRef.current[ind - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const datafromPaste = paste.split("");
    datafromPaste.forEach((element, key) => {
      if (otpRef.current[key]) {
        otpRef.current[key].value = element;
      }
    });
  };

  const hanndleEmail = async (e) => {
    e.preventDefault()
    try {
      let respones =await api.post("/api/changepassword", {
        email
      });
      if (respones.data.success) {
        setenterEmail(true);
        toast.success("OTP Sented Succssfully")
      }
    } catch(err) {
      console.log("Err Occure"+err)
      toast.error(err)
    }
  }

  const verifyHandler = async (e) => {
    e.preventDefault();
      const inputOTP = otpRef.current.map((e) => e.value);
      const otp = inputOTP.join("");
    setOtp(otp)
    setEnterOtp(true)
  };
  
  const PasswordHandler = async (e) => {
    e.preventDefault();
    try {
      const respones = await api.post("/api/setPassword", {
        email,
        otp,
        Password,
      })
      if (respones.data.success) {
        toast.success("Password Changed Successfully")
        navigate("/login")
      } else {
        toast.error(respones.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center  bg-white dark:bg-gray-800 ">
      {!enterEmail && (
        <div className="border-white border-2 rounded-2xl p-3.5 bg-[#4f7c70] flex flex-col items-center min-w-4/6 sm:min-w-min sm:w-96">
          <div className=" text-2xl font-bold  text-white  ">
            {" "}
            Reset Password{" "}
            </div>
            <h3 className=" text-blue-500 text-center mt-2 mb-1">
          Enter your Registered email address
        </h3>  

        <div className=" flex w-full   gap-1 my-3 border border-white p-3 rounded-2xl dark:bg-gray-800">
          <svg
            className=""
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>

            <input
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              placeholder="Enter Email"
              className="text-white outline-0"
            />
        </div>

        <button onClick={hanndleEmail} className="font-bold cursor-pointer mt-1.5 text-shadow-amber-200 px-4 w-full bg-green-300 text-white  py-2 border border-white rounded-full">
          Submit
        </button>
      </div>
        )}
      {
        !enterotp &&enterEmail&& (
          
        <div className="border-white border-2 rounded-2xl p-3.5 bg-[#4f7c70] flex flex-col items-center min-w-4/6 sm:min-w-min sm:w-96">
        <div className=" text-2xl font-bold  text-white  "> Verify Email </div>

        <h3 className=" text-blue-500 text-center mt-2 mb-4 ">
          Enter the verification code sent to your email address.
        </h3>
        <div className="flex mb-3 gap-2 justify-center" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, ind) => (
              <input
                maxLength="1"
                key={ind}
                required=""
                ref={(e) => (otpRef.current[ind] = e)}
                onInput={(e) => handleInput(e, ind)}
                onKeyDown={(e) => handleKeyDown(e, ind)}
                className="w-12 h-12 bg-[#333A5C] text-white  text-center text-xl rounded-md outline-0"
                type="text"
              />
            ))}
        </div>

        <button
          onClick={verifyHandler}
          className="font-bold cursor-pointer mt-1.5 text-shadow-amber-200 px-4 w-full bg-green-300 text-white  py-2 border border-white rounded-full"
        >
          Submit
        </button>
      </div>
        )
  }
      {enterotp && enterEmail&&(
        <div className="border-white border-2 rounded-2xl p-3.5 bg-[#4f7c70] flex flex-col items-center min-w-4/6 sm:min-w-min sm:w-96">
          <div className=" text-2xl font-bold  text-white  ">
            {" "}
            Reset Password{" "}
            </div>
            <h3 className=" text-blue-500 text-center mt-2 mb-1">
          Enter New Password
        </h3>  

        <div className=" flex w-full   gap-1 my-3 border border-white p-3 rounded-2xl dark:bg-gray-800">
          <svg
            className=""
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>

            <input
              type="text"
              value={Password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              placeholder="Enter New Password"
              className="text-white outline-0"
            />
        </div>

        <button onClick={PasswordHandler} className="font-bold cursor-pointer mt-1.5 text-shadow-amber-200 px-4 w-full bg-green-300 text-white  py-2 border border-white rounded-full">
          Submit
        </button>
      </div>
      )}
    </div>
  );
};

export default RestPassword;
