// Notifications.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import NotificationCard from '../components/NotificationCard';
import axios from 'axios';
import { serverUrl } from '../App';
import { setNotificationData } from '../redux/userSlice';

function Notifications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notificationData } = useSelector(state => state.user);

  // Mark all notifications as read
  const markAsRead = async () => {
    try {
      const ids = notificationData.map(n => n._id);
      await axios.post(`${serverUrl}/api/user/markAsRead`, { notificationId: ids }, { withCredentials: true });
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/getAllNotifications`, { withCredentials: true });
      dispatch(setNotificationData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    markAsRead();
  }, []);

  return (
    <div className='w-full h-[100vh] bg-black overflow-auto'>
      
      {/* Header */}
      <div className='w-full h-[80px] flex items-center gap-4 px-5 lg:hidden border-b border-gray-800'>
        <MdOutlineKeyboardBackspace
          className='text-white w-6 h-6 cursor-pointer'
          onClick={() => navigate(`/`)}
        />
        <h1 className='text-white text-xl font-semibold'>Notifications</h1>
      </div>

      {/* Notification list */}
      <div className='w-full flex flex-col gap-4 px-3 py-2'>
        {notificationData?.length > 0 ? (
          notificationData.map((noti) => (
            <NotificationCard noti={noti} key={noti._id} />
          ))
        ) : (
          <div className='text-white text-center py-10'>No notifications yet.</div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
