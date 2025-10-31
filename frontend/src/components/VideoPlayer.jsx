// VideoPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiVolume2, FiVolumeX } from "react-icons/fi";

function VideoPlayer({ media }) {
  const videoRef = useRef();
  const [mute, setMute] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

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
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer shadow-lg">
      <video
        ref={videoRef}
        src={media}
        autoPlay
        loop
        muted={mute}
        className="w-full h-full object-cover rounded-2xl"
        onClick={handleClick}
      />
      <div
        className="absolute bottom-3 right-3 bg-black bg-opacity-50 p-2 rounded-full flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          setMute((prev) => !prev);
        }}
      >
        {mute ? (
          <FiVolumeX className="text-white w-6 h-6" />
        ) : (
          <FiVolume2 className="text-white w-6 h-6" />
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
