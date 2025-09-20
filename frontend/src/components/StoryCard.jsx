// StoryCard.jsx
import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import VideoPlayer from './VideoPlayer';
import { FaEye } from "react-icons/fa6";

function StoryCard({ storyData }) {
  const { userData } = useSelector(state => state.user)
  const [showViewers, setShowViewers] = useState(false)
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          navigate("/")
          return 100
        }
        return prev + 1
      })
    }, 150)

    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div className='w-full max-w-[500px] h-screen border-x-2 border-gray-800 pt-2 relative flex flex-col justify-center bg-gray-900'>

      {/* Header */}
      <div className='flex items-center gap-3 absolute top-6 px-4'>
        <MdOutlineKeyboardBackspace 
          className='text-white cursor-pointer w-6 h-6' 
          onClick={() => navigate(`/`)} 
        />
        <div className='w-10 h-10 md:w-12 md:h-12 border-2 border-gray-700 rounded-full cursor-pointer overflow-hidden'>
          <img src={storyData?.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
        </div>
        <div className='w-[120px] font-semibold truncate text-white'>{storyData?.author?.userName}</div>
      </div>

      {/* Progress Bar */}
      <div className='absolute top-2 w-full h-1 bg-gray-700 rounded'>
        <div className='h-full bg-white rounded transition-all duration-150 ease-linear' style={{ width: `${progress}%` }} />
      </div>

      {/* Story Media */}
      {!showViewers && (
        <div className='w-full h-[90vh] flex items-center justify-center'>
          {storyData?.mediaType === "image" && (
            <img src={storyData?.media} alt="" className='h-[80%] rounded-2xl object-cover shadow-md' />
          )}
          {storyData?.mediaType === "video" && (
            <div className='h-[80%] w-full flex items-center justify-center'>
              <VideoPlayer media={storyData?.media} />
            </div>
          )}

          {/* Viewers toggle */}
          {storyData?.author?.userName === userData?.userName && (
            <div 
              className='absolute bottom-4 w-full flex items-center gap-3 p-3 cursor-pointer bg-black/50 rounded-t-xl' 
              onClick={() => setShowViewers(true)}
            >
              <div className='text-white flex items-center gap-2'>
                <FaEye /> {storyData?.viewers.length}
              </div>
              <div className='flex relative'>
                {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                  <div key={index} 
                       className={`w-8 h-8 border-2 border-gray-700 rounded-full overflow-hidden absolute ${index > 0 ? `left-[${index*20}px]` : ""}`}>
                    <img src={viewer?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Viewer List */}
      {showViewers && (
        <>
          <div className='w-full h-[30%] flex items-center justify-center mt-[100px] cursor-pointer py-4' onClick={() => setShowViewers(false)}>
            {storyData?.mediaType === "image" && (
              <img src={storyData?.media} alt="" className='h-full rounded-2xl object-cover shadow-lg' />
            )}
            {storyData?.mediaType === "video" && (
              <div className='h-full w-full flex items-center justify-center'>
                <VideoPlayer media={storyData?.media} />
              </div>
            )}
          </div>

          <div className='w-full h-[70%] border-t-2 border-gray-800 p-4 overflow-auto'>
            <div className='text-white flex items-center gap-2 mb-4'>
              <FaEye /> {storyData?.viewers.length} Viewers
            </div>
            <div className='flex flex-col gap-3'>
              {storyData?.viewers?.map((viewer, index) => (
                <div key={index} className='flex items-center gap-4'>
                  <div className='w-10 h-10 md:w-12 md:h-12 border-2 border-gray-700 rounded-full overflow-hidden'>
                    <img src={viewer?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                  </div>
                  <div className='font-semibold text-white truncate'>{viewer?.userName}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  )
}

export default StoryCard
