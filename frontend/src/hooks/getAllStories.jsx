import axios from 'axios';
import { serverUrl } from '../App';
// 'setFollowing' aur 'setUserData' yahaan istemaal nahin ho rahe the, isliye hata diya.
import { setStoryList } from '../redux/storySlice';

// --- YEH HAI SAHI TAREKA ---
// React, useEffect, useDispatch, useSelector ko hata diya gaya hai.
// Function ab 'dispatch' ko seedha argument mein leta hai.
const getAllStories = async (dispatch) => {
  try {
    const result = await axios.get(`${serverUrl}/api/story/getAll`, {
      withCredentials: true,
    });
    // Yeh seedha App.jsx se pass huye 'dispatch' ko istemaal karta hai.
    dispatch(setStoryList(result.data));
  } catch (error) {
    console.log("Error fetching stories:", error);
  }
};

export default getAllStories;
