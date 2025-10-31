import axios from 'axios';
import { serverUrl } from '../App';
// 'setUserData' aur 'setPostData' yahaan istemaal nahin ho rahe the, isliye hata diya.
import { setNotificationData } from '../redux/userSlice';

// --- YEH HAI SAHI TAREKA ---
// React, useEffect, useDispatch, useSelector ko hata diya gaya hai.
// Function ab 'dispatch' ko seedha argument mein leta hai.
const getAllNotifications = async (dispatch) => {
  try {
    const result = await axios.get(`${serverUrl}/api/user/getAllNotifications`, {
      withCredentials: true,
    });
    // Yeh seedha App.jsx se pass huye 'dispatch' ko istemaal karta hai.
    dispatch(setNotificationData(result.data));
  } catch (error) {
    console.log("Error fetching notifications:", error);
  }
};

export default getAllNotifications;
