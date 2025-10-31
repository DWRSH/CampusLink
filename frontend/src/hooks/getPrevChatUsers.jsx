import axios from 'axios';
import { serverUrl } from '../App';
// 'setFollowing', 'setUserData', 'setCurrentUserStory' yahaan istemaal nahin ho rahe the, isliye hata diya.
import { setPrevChatUsers } from '../redux/messageSlice';

// --- YEH HAI SAHI TAREKA ---
// React, useEffect, useDispatch, useSelector ko hata diya gaya hai.
// Function ab 'dispatch' ko seedha argument mein leta hai.
const getPrevChatUsers = async (dispatch) => {
  try {
    const result = await axios.get(`${serverUrl}/api/message/prevChats`, {
      withCredentials: true,
    });
    // Yeh seedha App.jsx se pass huye 'dispatch' ko istemaal karta hai.
    dispatch(setPrevChatUsers(result.data));
    console.log(result.data);
  } catch (error) {
    console.log("Error fetching prev chat users:", error);
  }
};

export default getPrevChatUsers;
