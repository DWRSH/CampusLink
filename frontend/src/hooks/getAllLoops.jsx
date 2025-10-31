import axios from 'axios';
import { serverUrl } from '../App'; // serverUrl ko App.jsx se import karein
import { setLoopData } from '../redux/loopSlice';

// --- YEH HAI SAHI TAREKA ---
// Yeh ab ek simple async function hai, React component nahin.
// Yeh 'dispatch' ko argument ke roop mein leta hai.
const getAllLoops = async (dispatch) => {
  // Humne yahan se useDispatch(), useSelector(), aur useEffect() hata diya hai.
  try {
    const result = await axios.get(`${serverUrl}/api/loop/getAll`, {
      withCredentials: true,
    });
    // Yeh seedha us 'dispatch' function ko istemaal karta hai jo App.jsx se pass hua hai.
    dispatch(setLoopData(result.data));
  } catch (error) {
    console.log("Error fetching loops:", error);
  }
};

export default getAllLoops;
