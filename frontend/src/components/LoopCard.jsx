// LoopCard.jsx
import React, { useState, useEffect, useRef } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import dp from "../assets/dp.webp";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { setLoopData } from "../redux/loopSlice";
import axios from "axios";
import { serverUrl } from "../App";

function LoopCard({ loop }) {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");

  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { loopData } = useSelector((state) => state.loop);
  const dispatch = useDispatch();
  const commentRef = useRef();

  // ✅ Video progress
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  // ✅ Like on double-tap
  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800); // shorter like Instagram
    if (!loop.likes?.includes(userData._id)) handleLike();
  };

  // ✅ Play/pause on tap
  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // ✅ Like API
  const handleLike = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/loop/like/${loop._id}`,
        { withCredentials: true }
      );
      const updatedLoop = result.data;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Comment API
  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedLoop = result.data;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Close comment box on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false);
      }
    };
    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showComment]);

  // ✅ Auto play/pause when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.7 }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  // ✅ Live updates via socket
  useEffect(() => {
    socket?.on("likedLoop", (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id === updatedData.loopId
          ? { ...p, likes: updatedData.likes }
          : p
      );
      dispatch(setLoopData(updatedLoops));
    });

    socket?.on("commentedLoop", (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id === updatedData.loopId
          ? { ...p, comments: updatedData.comments }
          : p
      );
      dispatch(setLoopData(updatedLoops));
    });

    return () => {
      socket?.off("likedLoop");
      socket?.off("commentedLoop");
    };
  }, [socket, loopData, dispatch]);

  return (
    <div className="w-full lg:w-[480px] h-screen flex items-center justify-center border-l border-r border-gray-800 relative bg-black overflow-hidden">
      {/* ❤️ Double-tap animation */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center z-50 animate-ping">
          <GoHeartFill className="w-[100px] h-[100px] text-red-600 drop-shadow-xl" />
        </div>
      )}

      {/* 📩 Comment section */}
      <div
        ref={commentRef}
        className={`absolute z-50 bottom-0 w-full h-[500px] p-4 rounded-t-3xl bg-[#0e1718] transform transition-transform duration-500 ease-in-out shadow-2xl ${
          showComment ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <h1 className="text-white text-lg text-center font-semibold">
          Comments
        </h1>
        <div className="w-full h-[350px] overflow-y-auto flex flex-col gap-4 mt-4">
          {loop.comments.length === 0 && (
            <div className="text-center text-gray-400 text-base">
              No comments yet
            </div>
          )}
          {loop.comments?.map((com, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 border-b border-gray-700 pb-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={com.author?.profileImage || dp}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-white font-medium">
                  {com.author?.userName}
                </span>
              </div>
              <div className="text-gray-200 ml-11">{com.message}</div>
            </div>
          ))}
        </div>
        {/* ✍️ Comment input */}
        <div className="absolute bottom-0 left-0 w-full flex items-center px-4 py-3 bg-[#0e1718]">
          <img
            src={loop.author?.profileImage || dp}
            alt=""
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
          <input
            type="text"
            className="flex-1 bg-transparent border-b border-gray-600 text-white px-2 py-1 outline-none"
            placeholder="Write a comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {message && (
            <IoSendSharp
              onClick={handleComment}
              className="ml-2 w-6 h-6 text-blue-500 cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* 🎥 Video */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMute}
        loop
        src={loop?.media}
        className="w-full h-full object-cover"
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
        onDoubleClick={handleLikeOnDoubleClick}
      />

      {/* 🔊 Mute button */}
      <div
        className="absolute top-4 right-4 text-white cursor-pointer"
        onClick={() => setIsMute((prev) => !prev)}
      >
        {!isMute ? <FiVolume2 size={22} /> : <FiVolumeX size={22} />}
      </div>

      {/* 📊 Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-orange-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* ℹ️ Bottom info & actions */}
      <div className="absolute bottom-20 left-4 text-white w-[80%]">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={loop.author?.profileImage || dp}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold">{loop.author?.userName}</span>
          <FollowButton
            targetUserId={loop.author?._id}
            tailwind="px-3 py-1 border border-white text-sm rounded-2xl"
          />
        </div>
        <p className="text-sm">{loop.caption}</p>
      </div>

      {/* ❤️ 💬 Actions sidebar */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 text-white">
        <div className="flex flex-col items-center cursor-pointer" onClick={handleLike}>
          {loop.likes.includes(userData._id) ? (
            <GoHeartFill className="w-7 h-7 text-red-500" />
          ) : (
            <GoHeart className="w-7 h-7" />
          )}
          <span className="text-xs">{loop.likes.length}</span>
        </div>
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setShowComment(true)}
        >
          <MdOutlineComment className="w-7 h-7" />
          <span className="text-xs">{loop.comments.length}</span>
        </div>
      </div>
    </div>
  );
}

export default LoopCard;
