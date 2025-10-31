import axios from 'axios';
import { serverUrl } from '../App';
// 'setFollowing' yahaan istemaal nahin ho raha tha, isliye hata diya.
import { setUserData } from '../redux/userSlice';
import { setCurrentUserStory } from '../redux/storySlice';

// --- YEH HAI SAHI TAREKA ---
// React, useEffect, useDispatch, useSelector ko hata diya gaya hai.
// Function ab 'dispatch' ko seedha argument mein leta hai.
const getCurrentUser = async (dispatch) => {
  try {
    const result = await axios.get(`${serverUrl}/api/user/current`, {
      withCredentials: true,
    });
    // Yeh seedha App.jsx se pass huye 'dispatch' ko istemaal karta hai.
    dispatch(setUserData(result.data));
    dispatch(setCurrentUserStory(result.data.story));
  } catch (error) {
    console.log("Error fetching current user:", error);
    // Agar user fetch nahin hota hai (jaise token nahin hai), toh login page par hi rahenge.
  }
};

export default getCurrentUser;
