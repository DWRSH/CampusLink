import axios from 'axios';
import { serverUrl } from '../App';
// 'setUserData' yahaan istemaal nahin ho raha tha, isliye hata diya.
import { setSuggestedUsers } from '../redux/userSlice';

// --- YEH HAI SAHI TAREKA ---
// React, useEffect, useDispatch, useSelector ko hata diya gaya hai.
// Function ab 'dispatch' ko seedha argument mein leta hai.
const getSuggestedUsers = async (dispatch) => {
  try {
    const result = await axios.get(`${serverUrl}/api/user/suggested`, {
      withCredentials: true,
    });
    // Yeh seedha App.jsx se pass huye 'dispatch' ko istemaal karta hai.
    dispatch(setSuggestedUsers(result.data));
  } catch (error)
 {
    console.log("Error fetching suggested users:", error);
  }
};

export default getSuggestedUsers;
