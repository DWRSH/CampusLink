// Feed.jsx
import React from 'react'
import logo from "../assets/logo.png"
import { FaRegHeart } from "react-icons/fa6";
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import { BiMessageAltDetail } from "react-icons/bi";
import Post from './Post';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

function Feed() {
  const { postData } = useSelector(state => state.post)
  const { userData, notificationData } = useSelector(state => state.user)
  const { storyList, currentUserStory } = useSelector(state => state.story)
  const navigate = useNavigate()

  return (
    <div className='lg:w-[50%] w-full bg-gradient-to-b from-gray-900 via-black to-gray-900 min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto'>

      {/* Top Bar for Mobile */}
      <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'>
        <img src={logo} alt="logo" className='w-[80px]' />
        <div className='flex items-center gap-[15px]'>
          <div className='relative cursor-pointer' onClick={() => navigate("/notifications")}>
            <FaRegHeart className='text-white w-[25px] h-[25px]' />
            {notificationData?.length > 0 && notificationData.some((noti) => !noti.isRead) && (
              <div className='w-[10px] h-[10px] bg-blue-500 rounded-full absolute top-0 right-[-5px]'></div>
            )}
          </div>
          <BiMessageAltDetail
            className='text-white w-[25px] h-[25px] cursor-pointer'
            onClick={() => navigate("/messages")}
          />
        </div>
      </div>

      {/* Stories */}
      <div className='flex w-full justify-start overflow-x-auto gap-[10px] items-center p-[20px]'>
        <StoryDp userName={"Your Story"} ProfileImage={userData.profileImage} story={currentUserStory} />
        {storyList?.map((story, index) => (
          <StoryDp userName={story.author.userName} ProfileImage={story.author.profileImage} story={story} key={index} />
        ))}
      </div>

      {/* Posts */}
      <div className='w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-gray-800 rounded-t-[60px] relative pb-[120px]'>
        <Nav />
        {postData && postData.map((post, index) => (
          <ErrorBoundary key={index}>
            <Post post={post} />
          </ErrorBoundary>
        ))}
      </div>

    </div>
  )
}

export default Feed
