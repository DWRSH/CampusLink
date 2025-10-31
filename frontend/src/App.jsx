import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";

import { useDispatch, useSelector } from "react-redux";

// Import your custom hooks
import getCurrentUser from "./hooks/getCurrentUser";
import getSuggestedUsers from "./hooks/getSuggestedUsers";
import getAllPost from "./hooks/getAllPost";
import getAllLoops from "./hooks/getAllLoops";
import getAllStories from "./hooks/getAllStories";
import getFollowingList from "./hooks/getFollowingList";
import getPrevChatUsers from "./hooks/getPrevChatUsers";
import getAllNotifications from "./hooks/getAllNotifications";

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
import AdminLoopPanel from "./pages/AdminLoopPanel";

import { io } from "socket.io-client";
import { setOnlineUsers } from "./redux/socketSlice";
import { setNotificationData } from "./redux/userSlice";

export const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://campuslink-backend-rw6d.onrender.com"
    : "http://localhost:8000";

function App() {
  const { userData, notificationData } = useSelector((state) => state.user);
  
  // --- FIX FOR REACT ERROR #321 ---
  // Hum dispatch function ko yahaan, component ke andar, ek baar call karenge.
  // Yeh React ke rules ke hisaab se sahi hai.
  const dispatch = useDispatch();

  // Yeh hook app load hone par user data fetch karta hai.
  // Hum ab `dispatch` ko as an argument pass kar rahe hain.
  useEffect(() => {
    getCurrentUser(dispatch); // <-- DISPATCH KO YAHAN PASS KAREIN
  }, [dispatch]); // dispatch ko dependency array mein add karein

  // Yeh hook baaki data tab fetch karta hai jab user data aa jaata hai.
  // Hum `dispatch` ko sabhi hooks mein pass karenge.
  useEffect(() => {
    if (userData) {
      // Sabhi hooks mein dispatch pass karein
      getSuggestedUsers(dispatch);
      getAllPost(dispatch);
      getAllLoops(dispatch);
      getAllStories(dispatch);
      getFollowingList(dispatch);
      getPrevChatUsers(dispatch);
      getAllNotifications(dispatch);
    }
  }, [userData, dispatch]); // dispatch ko dependency array mein add karein
  // --- END OF FIX ---

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
        // Check karein ki notificationData ek array hai
        const currentNotifications = Array.isArray(notificationData) ? notificationData : [];
        dispatch(setNotificationData([...currentNotifications, noti]));
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
      />
    </Routes>
  );
}

export default App;

