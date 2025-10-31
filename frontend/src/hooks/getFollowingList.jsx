import axios from 'axios';
import { serverUrl } from '../App';
// 'setUserData' aur 'setCurrentUserStory' yahaan istemaal nahin ho rahe the, isliye hata diya.
import { setFollowing } from '../redux/userSlice';

// --- YEH HAI SAHI TAREKA ---
// React, useEffect, useDispatch, useSelector ko hata diya gaya hai.
// Function ab 'dispatch' ko seedha argument mein leta hai.
const getFollowingList = async (dispatch) => {
  try {
    const result = await axios.get(`${serverUrl}/api/user/followingList`, {
      withCredentials: true,
    });
    // Yeh seedha App.jsx se pass huye 'dispatch' ko istemaal karta hai.
    dispatch(setFollowing(result.data));
  } catch (error) {
    console.log("Error fetching following list:", error);
  }
};

export default getFollowingList;
