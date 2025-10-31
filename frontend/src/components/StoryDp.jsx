// StoryDp.jsx
import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';

function StoryDp({ ProfileImage, userName, story }) {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  const { storyData, storyList } = useSelector(state => state.story)
  const [viewed, setViewed] = useState(false)

  // Check if the story has been viewed
  useEffect(() => {
    if (story?.viewers?.some((viewer) =>
      viewer?._id?.toString() === userData._id.toString() || viewer?.toString() === userData._id.toString()
    )) {
      setViewed(true)
    } else {
      setViewed(false)
    }
  }, [story, userData, storyData, storyList])

  const handleViewers = async () => {
    try {
      await axios.get(`${serverUrl}/api/story/view/${story._id}`, { withCredentials: true })
    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = () => {
    if (!story && userName === "Your Story") {
      navigate("/upload")
    } else {
      if (story && userName === "Your Story") {
        handleViewers()
        navigate(`/story/${userData?.userName}`)
      } else {
        handleViewers()
        navigate(`/story/${userName}`)
      }
    }
  }

  return (
    <div className='flex flex-col w-[80px] items-center'>
      <div
        className={`w-[80px] h-[80px] rounded-full flex items-center justify-center relative cursor-pointer
          transition-transform duration-200 ease-in-out hover:scale-105
          ${!story ? "bg-gradient-to-br from-purple-500 to-pink-500" : !viewed ? "bg-gradient-to-br from-yellow-400 via-red-500 to-pink-600" : "bg-gray-800"}
        `}
        onClick={handleClick}
      >
        <div className='w-[70px] h-[70px] border-2 border-black rounded-full overflow-hidden flex items-center justify-center bg-gray-900'>
          <img src={ProfileImage || dp} alt="" className='w-full h-full object-cover' />
          {!story && userName === "Your Story" && (
            <FiPlusCircle className='absolute bottom-0 right-0 bg-white rounded-full w-5 h-5 p-[2px] text-black shadow-md' />
          )}
        </div>
      </div>
      <div className='text-[14px] text-center truncate w-full text-white mt-2'>{userName}</div>
    </div>
  )
}

export default StoryDp
