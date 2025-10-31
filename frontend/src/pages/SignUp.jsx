// SignUp.jsx
import React, { useState } from 'react';
import logo from "../assets/logo1.svg";
import logo1 from "../assets/logo.svg";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { serverUrl } from '../App';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

function SignUp() {
  const [inputClicked, setInputClicked] = useState({
    name: false,
    userName: false,
    email: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    setErr("");
    try {
      await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, userName, email, password },
        { withCredentials: true }
      );
      setLoading(false);
      navigate("/signin"); // ✅ Redirect to SignIn after successful signup
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col justify-center items-center">
      <div className="w-[95%] lg:max-w-[60%] h-[600px] bg-white/95 backdrop-blur-md rounded-3xl flex justify-center items-center overflow-hidden shadow-2xl border border-gray-200">
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-6 gap-6">
          
          {/* Header */}
          <div className="flex gap-3 items-center text-xl font-bold text-gray-900 mt-8">
            <span>Sign Up to</span>
            <img src={logo} alt="logo" className="w-40" />
          </div>

          {/* Name Input */}
          <div 
            className="relative flex items-center w-[90%] h-[55px] rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 transition-all duration-300"
            onClick={() => setInputClicked({ ...inputClicked, name: true })}
          >
            <label
              htmlFor="name"
              className={`absolute left-4 px-1 text-sm transition-all duration-300 
              ${inputClicked.name || name ? "top-[-12px] text-indigo-600 bg-white" : "top-3 text-gray-500"}`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full h-full rounded-xl px-4 outline-none border-0 text-gray-900"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Username Input */}
          <div 
            className="relative flex items-center w-[90%] h-[55px] rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 transition-all duration-300"
            onClick={() => setInputClicked({ ...inputClicked, userName: true })}
          >
            <label
              htmlFor="userName"
              className={`absolute left-4 px-1 text-sm transition-all duration-300 
              ${inputClicked.userName || userName ? "top-[-12px] text-indigo-600 bg-white" : "top-3 text-gray-500"}`}
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

          {/* Email Input */}
          <div 
            className="relative flex items-center w-[90%] h-[55px] rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 transition-all duration-300"
            onClick={() => setInputClicked({ ...inputClicked, email: true })}
          >
            <label
              htmlFor="email"
              className={`absolute left-4 px-1 text-sm transition-all duration-300 
              ${inputClicked.email || email ? "top-[-12px] text-indigo-600 bg-white" : "top-3 text-gray-500"}`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full h-full rounded-xl px-4 outline-none border-0 text-gray-900"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password Input */}
          <div 
            className="relative flex items-center w-[90%] h-[55px] rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 transition-all duration-300"
            onClick={() => setInputClicked({ ...inputClicked, password: true })}
          >
            <label
              htmlFor="password"
              className={`absolute left-4 px-1 text-sm transition-all duration-300 
              ${inputClicked.password || password ? "top-[-12px] text-indigo-600 bg-white" : "top-3 text-gray-500"}`}
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

          {/* Error Message */}
          {err && <p className="text-red-500 text-sm">{err}</p>}

          {/* Sign Up Button */}
          <button
            className="w-[70%] py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-70 mt-6"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? <ClipLoader size={28} color="white" /> : "Sign Up"}
          </button>

          {/* Sign In Link */}
          <p 
            className="cursor-pointer text-gray-700 text-sm mt-3"
            onClick={() => navigate("/signin")}
          >
            Already have an account?{" "}
            <span className="font-semibold text-indigo-600 border-b-2 border-indigo-600">Sign In</span>
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
            <Typewriter
              words={["Not Just A Platform, It's A VYBE ✨"]}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default SignUp;
