import React from "react";
import { useContext } from "react";
import { UserContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { api, setUserData } = useContext(UserContext);

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

  const verifyHandler = async (e) => {
    e.preventDefault();
    try {
      const inputOTP = otpRef.current.map((e) => e.value);
      const otp = inputOTP.join("");
      const response = await api.post("/api/verifyEmail", {
        otp,
      });

      if (response.data.success) {
        toast.success("OTP has Varifyed Successfully");
        setUserData(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } else {
        toast.error(error.message);
      }
    } catch (err) {
      console.log("something Occure Wrong", err);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center  bg-white dark:bg-gray-800 ">
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
                className="w-12 h-12 bg-[#333A5C] text-white  text-center text-xl rounded-md"
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
    </div>
  );
};

export default VerifyEmail;
