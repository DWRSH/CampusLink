import React from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import OnlineUser from '../components/OnlineUser';
import { setSelectedUser } from '../redux/messageSlice';
import dp from "../assets/dp.webp";
import usePrevChatUsers from '../hooks/getPrevChatUsers';

function Messages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { onlineUsers } = useSelector(state => state.socket);
  const { prevChatUsers } = useSelector(state => state.message);

  // Call hook to fetch prev chat users on mount and when messages update
  usePrevChatUsers();

  return (
    <div className='w-full min-h-[100vh] flex flex-col bg-[#121212] gap-4'>

      {/* Header */}
      <div className='w-full h-[80px] flex items-center gap-4 px-5 border-b border-gray-800'>
        <MdOutlineKeyboardBackspace
          className='text-white w-6 h-6 cursor-pointer lg:hidden'
          onClick={() => navigate(`/`)}
        />
        <h1 className='text-white text-xl font-semibold'>Messages</h1>
      </div>

      {/* Online Users */}
      <div className='w-full h-[80px] flex gap-4 overflow-x-auto px-5 py-2 border-b border-gray-800'>
        {userData.following?.map((user) => 
          onlineUsers?.includes(user._id) && <OnlineUser key={user._id} user={user} />
        )}
      </div>

      {/* Previous Chat Users */}
      <div className='flex-1 overflow-auto px-5 py-3 flex flex-col gap-4'>
        {prevChatUsers?.map((user) => (
          <div
            key={user._id}
            className='w-full flex items-center gap-4 cursor-pointer'
            onClick={() => {
              dispatch(setSelectedUser(user));
              navigate("/messageArea");
            }}
          >
            {onlineUsers?.includes(user._id) ? (
              <OnlineUser user={user} />
            ) : (
              <div className='w-12 h-12 border-2 border-gray-700 rounded-full overflow-hidden'>
                <img src={user.profileImage || dp} alt="" className='w-full h-full object-cover' />
              </div>
            )}

            <div className='flex flex-col'>
              <span className='text-white text-lg font-semibold'>{user.userName}</span>
              {onlineUsers?.includes(user._id) && (
                <span className='text-blue-500 text-sm'>Active Now</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Messages;
