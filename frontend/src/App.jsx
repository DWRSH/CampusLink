import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Sahi paths (./pages/...)
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";

import { useDispatch, useSelector } from "react-redux";

// Sahi paths (./hooks/...)
import getCurrentUser from "./hooks/getCurrentUser";
import getSuggestedUsers from "./hooks/getSuggestedUsers";
import getAllPost from "./hooks/getAllPost";
import getAllLoops from "./hooks/getAllLoops";
import getAllStories from "./hooks/getAllStories";
import getFollowingList from "./hooks/getFollowingList";
import getPrevChatUsers from "./hooks/getPrevChatUsers";
import getAllNotifications from "./hooks/getAllNotifications";

// Sahi paths (./pages/...)
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload";
import Loops from "./pages/Loops";
import Story from "./pages/Story";
import Messages from "./pages/Messages";
import MessageArea from "./pages/MessageArea";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";

import Admin from "./pages/Admin";
import AdminPosts from "./pages/AdminPostPanel";
import AdminLoopPanel from "./pages/AdminLoopPanel"; // <-- Import new admin loop panel

import { io } from "socket.io-client";
// Sahi paths (./redux/...)
import { setOnlineUsers } from "./redux/socketSlice";
import { setNotificationData } from "./redux/userSlice";

// --- YEH AAPKA PEHLA FIX HAI ---
// URL ko dynamic banaya gaya hai
export const serverUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : "https://campuslink-backend-rw6d.onrender.com"; // Aapka deployed backend URL

function App() {
  // --- YEH AAPKA DOOSRA FIX HAI ---
  // Hooks ko useEffect ke andar daala gaya hai taaki woh har render par na chalein

  // getCurrentUser ko pehle call karein taaki user data load ho sake
  getCurrentUser();

  const { userData, notificationData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Baaki saare data ko tab fetch karein jab userData aa jaaye
  useEffect(() => {
    if (userData) {
      getSuggestedUsers();
      getAllPost();
      getAllLoops();
      getAllStories();
      getFollowingList();
      getPrevChatUsers();
      getAllNotifications();
    }
  }, [userData]); // Yeh sirf tab chalega jab userData badlega

  useEffect(() => {
    if (userData) {
      const socketIo = io(`${serverUrl}`, {
        query: {
          userId: userData._id,
        },
      });

      window.socketInstance = socketIo;

      socketIo.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
        console.log(users);
      });

      return () => socketIo.close();
    } else {
      if (window.socketInstance) {
        window.socketInstance.close();
        delete window.socketInstance;
      }
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (window.socketInstance) {
      window.socketInstance.on("newNotification", (noti) => {
        dispatch(setNotificationData([...notificationData, noti]));
      });
    }
  }, [notificationData, dispatch]);

  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/profile/:userName"
        element={userData ? <Profile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/story/:userName"
        element={userData ? <Story /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/upload"
        element={userData ? <Upload /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/search"
        element={userData ? <Search /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/editprofile"
        element={userData ? <EditProfile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/messages"
        element={userData ? <Messages /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/messageArea"
        element={userData ? <MessageArea /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/notifications"
        element={userData ? <Notifications /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/admin"
        element={
          userData && userData.isAdmin ? <Admin /> : <Navigate to={"/"} />
        }
      />
      <Route
        path="/admin/posts"
        element={
          userData && userData.isAdmin ? <AdminPosts /> : <Navigate to="/" />
        }
      />
      <Route
        path="/admin/loops"
        element={
          userData && userData.isAdmin ? <AdminLoopPanel /> : <Navigate to="/" />
        }
      />
      <Route
        path="/loops"
        element={userData ? <Loops /> : <Navigate to={"/signin"} />}
      S/>
    </Routes>
  );
}

export default App;

