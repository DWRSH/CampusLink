import axios from 'axios';
import { serverUrl } from '../App';
// 'setUserData' yahaan istemaal nahin ho raha tha, isliye hata diya.
import { setPostData } from '../redux/postSlice';

// --- YEH HAI SAHI TAREKA ---
// React, useEffect, useDispatch, useSelector ko hata diya gaya hai.
// Function ab 'dispatch' ko seedha argument mein leta hai.
const getAllPost = async (dispatch) => {
  try {
    const result = await axios.get(`${serverUrl}/api/post/getAll`, {
      withCredentials: true,
    });
    // Yeh seedha App.jsx se pass huye 'dispatch' ko istemaal karta hai.
    dispatch(setPostData(result.data));
  } catch (error) {
    console.log("Error fetching posts:", error);
  }
};

export default getAllPost;
