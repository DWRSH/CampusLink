// OnlineUser.jsx
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedUser } from '../redux/messageSlice'
import dp from "../assets/dp.webp"

function OnlineUser({ user }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setSelectedUser(user))
    navigate(`/messageArea`)
  }

  return (
    <div className='relative flex flex-col items-center gap-2 w-[60px]'>
      
      {/* User Avatar */}
      <div 
        className='w-12 h-12 border-2 border-gray-700 rounded-full cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-200'
        onClick={handleClick}
      >
        <img src={user.profileImage || dp} alt={user.userName} className='w-full h-full object-cover'/>
      </div>

      {/* Online Indicator */}
      {user.isOnline && (
        <span className='absolute bottom-0 right-0 w-3 h-3 bg-[#00BFFF] border-2 border-gray-900 rounded-full'></span>
      )}
      
      {/* Optional Username */}
      <p className='text-xs text-white truncate w-full text-center'>{user.userName}</p>
    </div>
  )
}

export default OnlineUser
