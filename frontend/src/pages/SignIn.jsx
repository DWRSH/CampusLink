// SignIn.jsx
import React, { useState } from "react";
import logo from "../assets/logo1.svg";
import logo1 from "../assets/logo.svg";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";

function SignIn() {
  const [inputClicked, setInputClicked] = useState({
    userName: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    setLoading(true);
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { userName, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErr(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[95%] lg:max-w-[60%] h-[600px] bg-white/95 backdrop-blur-md rounded-3xl flex justify-center items-center overflow-hidden shadow-2xl border border-gray-200"
      >
        {/* Left Side - Form */}
        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-6 gap-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex gap-3 items-center text-xl font-bold text-gray-900 mt-8"
          >
            <span>Sign In to</span>
            <img src={logo} alt="logo" className="w-36" />
          </motion.div>

          {/* Username Input */}
          <div
            className="relative flex items-center w-[90%] h-[55px] rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 transition-all duration-300"
            onClick={() =>
              setInputClicked({ ...inputClicked, userName: true })
            }
          >
            <label
              htmlFor="userName"
              className={`absolute left-4 px-1 text-sm transition-all duration-300 
              ${
                inputClicked.userName || userName
                  ? "top-[-12px] text-indigo-600 bg-white"
                  : "top-3 text-gray-500"
              }`}
            >
              Username
            </label>
            <input
              type="text"
              id="userName"
              className="w-full h-full rounded-xl px-4 outline-none border-0 text-gray-900"
              required
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
          </div>

          {/* Password Input */}
          <div
            className="relative flex items-center w-[90%] h-[55px] rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 transition-all duration-300"
            onClick={() =>
              setInputClicked({ ...inputClicked, password: true })
            }
          >
            <label
              htmlFor="password"
              className={`absolute left-4 px-1 text-sm transition-all duration-300 
              ${
                inputClicked.password || password
                  ? "top-[-12px] text-indigo-600 bg-white"
                  : "top-3 text-gray-500"
              }`}
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full h-full rounded-xl px-4 outline-none border-0 text-gray-900"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {!showPassword ? (
              <IoIosEye
                className="absolute cursor-pointer right-4 w-6 h-6 text-gray-500 hover:text-indigo-600 transition"
                onClick={() => setShowPassword(true)}
              />
            ) : (
              <IoIosEyeOff
                className="absolute cursor-pointer right-4 w-6 h-6 text-gray-500 hover:text-indigo-600 transition"
                onClick={() => setShowPassword(false)}
              />
            )}
          </div>

          {/* Forgot Password */}
          <div
            className="w-[90%] text-right text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer transition"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </div>

          {/* Error */}
          {err && (
            <div className="w-[90%] p-2 bg-red-100 border border-red-400 text-red-600 text-sm rounded-md text-center">
              {err}
            </div>
          )}

          {/* Button */}
          <button
            className="w-[70%] py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-70 mt-4"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? <ClipLoader size={28} color="white" /> : "Sign In"}
          </button>


          {/* Sign Up */}
          <p
            className="cursor-pointer text-gray-700 text-sm mt-3"
            onClick={() => navigate("/signup")}
          >
            New here?{" "}
            <span className="font-semibold text-indigo-600 border-b-2 border-indigo-600">
              Sign Up
            </span>
          </p>
        </div>

        {/* Right Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:flex w-[50%] h-full justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 flex-col gap-4 text-white text-lg font-semibold rounded-l-[40px] shadow-inner"
        >
          <img src={logo1} alt="logo1" className="w-40 drop-shadow-lg" />
          <p className="italic tracking-wide">
            Not Just A Platform, It's A VYBE ✨
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SignIn;
