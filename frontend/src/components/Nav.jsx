  // Nav.jsx
import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { FiSearch, FiPlusSquare } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import dp from "../assets/dp.webp"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiOutlineShieldCheck } from 'react-icons/hi';

function Nav() {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)

  return (
    <div className='w-[90%] lg:w-[40%] h-[80px] bg-gradient-to-r from-gray-900 via-black to-gray-900 flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-black z-[100] border border-gray-800'>
      
      <div onClick={() => navigate("/")} className='p-2 hover:bg-gray-800 rounded-full transition'>
        <GoHomeFill className='text-white cursor-pointer w-[25px] h-[25px]'/>
      </div>
      
      <div onClick={() => navigate("/search")} className='p-2 hover:bg-gray-800 rounded-full transition'>
        <FiSearch className='text-white cursor-pointer w-[25px] h-[25px]'/>
      </div>
      
      <div onClick={() => navigate("/upload")} className='p-2 hover:bg-gray-800 rounded-full transition'>
        <FiPlusSquare className='text-white cursor-pointer w-[25px] h-[25px]'/>
      </div>
      
      <div onClick={() => navigate("/loops")} className='p-2 hover:bg-gray-800 rounded-full transition'>
        <RxVideo className='text-white cursor-pointer w-[28px] h-[28px]'/>
      </div>
      {/* Admin shield - visible only for admin users */}
      {userData && userData.isAdmin && (
        <div onClick={() => navigate('/admin')} className='p-2 hover:bg-gray-800 rounded-full transition'>
          <HiOutlineShieldCheck className='text-white cursor-pointer w-[25px] h-[25px]'/>
        </div>
      )}
      
      <div 
        className='w-[40px] h-[40px] border-2 border-gray-700 rounded-full cursor-pointer overflow-hidden hover:ring-2 hover:ring-gray-500 transition'
        onClick={() => navigate(`/profile/${userData.userName}`)}
      >
        <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover'/>
      </div>
      {/* ...existing code... */}
      
    </div>
  )
}

export default Nav
