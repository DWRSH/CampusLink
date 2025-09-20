// ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [inputClicked, setInputClicked] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleStep1 = async () => {
    setLoading(true);
    setErr("");
    setSuccess("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/sendOtp`,
        { email },
        { withCredentials: true }
      );
      console.log(result.data);
      setSuccess("✅ OTP sent successfully to your email!");
      setStep(2);
    } catch (error) {
      console.log(error);
      setErr(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleStep2 = async () => {
    setLoading(true);
    setErr("");
    setSuccess("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verifyOtp`,
        { email, otp },
        { withCredentials: true }
      );
      console.log(result.data);
      setStep(3);
    } catch (error) {
      console.log(error);
      setErr(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleStep3 = async () => {
    if (newPassword !== confirmNewPassword) {
      return setErr("Passwords do not match");
    }
    setLoading(true);
    setErr("");
    setSuccess("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/resetPassword`,
        { email, password: newPassword },
        { withCredentials: true }
      );
      console.log(result.data);
      setSuccess("🎉 Password reset successful!");
      setStep(4);
    } catch (error) {
      console.log(error);
      setErr(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col justify-center items-center">
      {/* Step 1: Enter Email */}
      {step === 1 && (
        <div className="w-[95%] max-w-[450px] bg-white/95 backdrop-blur-md rounded-3xl flex flex-col items-center p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Forgot Password
          </h2>

          <div
            className="relative flex items-center w-full h-[55px] rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 transition-all mb-6"
            onClick={() => setInputClicked({ ...inputClicked, email: true })}
          >
            <label
              htmlFor="email"
              className={`absolute left-4 px-1 bg-white text-sm transition-all duration-300 
              ${
                inputClicked.email || email
                  ? "top-[-12px] text-indigo-600"
                  : "top-3 text-gray-500"
              }`}
            >
              Enter Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full h-full rounded-xl px-4 outline-none border-0 text-gray-900"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={loading}
            />
          </div>

          {err && <p className="text-red-500 text-sm">{err}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            className="w-[70%] py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-70 mt-4"
            onClick={handleStep1}
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color="white" /> : "Send OTP"}
          </button>
        </div>
      )}

      {/* Step 2: Enter OTP */}
      {step === 2 && (
        <div className="w-[95%] max-w-[450px] bg-white/95 backdrop-blur-md rounded-3xl flex flex-col items-center p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Verify OTP
          </h2>

          <div
            className="relative flex items-center w-full h-[55px] rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 transition-all mb-6"
            onClick={() => setInputClicked({ ...inputClicked, otp: true })}
          >
            <label
              htmlFor="otp"
              className={`absolute left-4 px-1 bg-white text-sm transition-all duration-300 
              ${
                inputClicked.otp || otp
                  ? "top-[-12px] text-indigo-600"
                  : "top-3 text-gray-500"
              }`}
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full h-full rounded-xl px-4 outline-none border-0 text-gray-900"
              required
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              disabled={loading}
            />
          </div>

          {err && <p className="text-red-500 text-sm">{err}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            className="w-[70%] py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-70 mt-4"
            onClick={handleStep2}
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color="white" /> : "Verify OTP"}
          </button>
        </div>
      )}

      {/* Step 3: Reset Password */}
      {step === 3 && (
        <div className="w-[95%] max-w-[450px] bg-white/95 backdrop-blur-md rounded-3xl flex flex-col items-center p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reset Password
          </h2>

          {/* New Password */}
          <div
            className="relative flex items-center w-full h-[55px] rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 transition-all mb-6"
            onClick={() =>
              setInputClicked({ ...inputClicked, newPassword: true })
            }
          >
            <label
              htmlFor="newPassword"
              className={`absolute left-4 px-1 bg-white text-sm transition-all duration-300 
              ${
                inputClicked.newPassword || newPassword
                  ? "top-[-12px] text-indigo-600"
                  : "top-3 text-gray-500"
              }`}
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full h-full rounded-xl px-4 outline-none border-0 text-gray-900"
              required
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div
            className="relative flex items-center w-full h-[55px] rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 transition-all mb-6"
            onClick={() =>
              setInputClicked({ ...inputClicked, confirmNewPassword: true })
            }
          >
            <label
              htmlFor="confirmNewPassword"
              className={`absolute left-4 px-1 bg-white text-sm transition-all duration-300 
              ${
                inputClicked.confirmNewPassword || confirmNewPassword
                  ? "top-[-12px] text-indigo-600"
                  : "top-3 text-gray-500"
              }`}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              className="w-full h-full rounded-xl px-4 outline-none border-0 text-gray-900"
              required
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              value={confirmNewPassword}
              disabled={loading}
            />
          </div>

          {err && <p className="text-red-500 text-sm">{err}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            className="w-[70%] py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-70 mt-4"
            onClick={handleStep3}
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color="white" /> : "Reset Password"}
          </button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="w-[95%] max-w-[450px] bg-white/95 backdrop-blur-md rounded-3xl flex flex-col items-center p-8 shadow-xl text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            🎉 Password Reset Successful!
          </h2>
          <p className="text-gray-700 mb-6">
            Your password has been updated. You can now sign in with your new
            credentials.
          </p>
          <button
            className="w-[70%] py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition"
            onClick={() => navigate("/signin")}
          >
            Go to Sign In
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
