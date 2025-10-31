// LeftHome.jsx
import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { FaRegHeart } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";
import Notifications from "../pages/Notifications";

function LeftHome() {
  const { userData, suggestedUsers, notificationData } = useSelector(
    (state) => state.user
  );
  const [showNotification, setShowNotification] = useState(false);
  const dispatch = useDispatch();

  // ✅ Logout
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`w-[25%] hidden lg:flex flex-col h-screen 
      bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] 
      border-r border-gray-800 ${
        showNotification ? "overflow-hidden" : "overflow-auto"
      }`}
    >
      {/* 🔹 Logo + Notification */}
      <div className="w-full h-[80px] flex items-center justify-between px-6 border-b border-gray-700">
        <img src={logo} alt="logo" className="w-[140px]" />
        <div
          className="relative cursor-pointer"
          onClick={() => setShowNotification((prev) => !prev)}
        >
          <FaRegHeart className="text-pink-400 hover:text-pink-500 w-[26px] h-[26px] transition-colors" />
          {notificationData?.length > 0 &&
            notificationData.some((n) => n.isRead === false) && (
              <span className="w-[10px] h-[10px] bg-red-500 rounded-full absolute top-0 right-[-5px]" />
            )}
        </div>
      </div>

      {/* 🔹 Profile + Suggested Users */}
      {!showNotification && (
        <>
          {/* User profile */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700 bg-[#1e293b]/50">
            <div className="flex items-center gap-3">
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-pink-500 shadow-md shadow-pink-800/50">
                <img
                  src={userData.profileImage || dp}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-white font-semibold text-lg">
                  {userData.userName}
                </div>
                <div className="text-gray-400 text-sm">{userData.name}</div>
              </div>
            </div>
            <button
              onClick={handleLogOut}
              className="text-gray-400 hover:text-pink-400 flex items-center gap-2 transition-colors"
            >
              <FiLogOut />
              <span className="hidden xl:inline">Logout</span>
            </button>
          </div>

          {/* Suggested Users */}
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-base font-semibold">
                Suggested for you
              </h2>
              <span className="text-gray-400 text-sm cursor-pointer hover:text-pink-400 transition-colors">
                See All
              </span>
            </div>

            {suggestedUsers &&
              suggestedUsers.slice(0, 3).map((user, index) => (
                <OtherUser key={index} user={user} />
              ))}
          </div>
        </>
      )}

      {/* 🔹 Notifications */}
      {showNotification && <Notifications />}
    </div>
  );
}

export default LeftHome;
