// EditProfile.jsx
import React, { useState, useRef } from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dp from "../assets/dp.webp";
import axios from 'axios';
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';

function EditProfile() {
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp);
  const [backendImage, setBackendImage] = useState(null);

  const [name, setName] = useState(userData.name || "");
  const [userName, setUserName] = useState(userData.userName || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [profession, setProfession] = useState(userData.profession || "");
  const [gender, setGender] = useState(userData.gender || "");
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("userName", userName);
      formdata.append("bio", bio);
      formdata.append("profession", profession);
      formdata.append("gender", gender);
      if (backendImage) formdata.append("profileImage", backendImage);

      const result = await axios.post(`${serverUrl}/api/user/editProfile`, formdata, { withCredentials: true });
      dispatch(setProfileData(result.data));
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate(`/profile/${userData.userName}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100vh] bg-[#121212] flex flex-col items-center gap-6 p-4">
      {/* Header */}
      <div className="w-full max-w-[600px] flex items-center gap-4">
        <MdOutlineKeyboardBackspace
          className="text-white cursor-pointer w-6 h-6"
          onClick={() => navigate(`/profile/${userData.userName}`)}
        />
        <h1 className="text-white text-xl font-semibold">Edit Profile</h1>
      </div>

      {/* Profile Image */}
      <div
        className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] border-2 border-gray-600 rounded-full cursor-pointer overflow-hidden"
        onClick={() => imageInput.current.click()}
      >
        <input type="file" accept="image/*" ref={imageInput} hidden onChange={handleImage} />
        <img src={frontendImage} alt="Profile" className="w-full h-full object-cover" />
      </div>
      <div
        className="text-blue-500 text-center text-sm md:text-base font-semibold cursor-pointer"
        onClick={() => imageInput.current.click()}
      >
        Change Your Profile Picture
      </div>

      {/* Input Fields */}
      <div className="w-full max-w-[600px] flex flex-col gap-4">
        {[
          { value: name, setter: setName, placeholder: "Enter Your Name" },
          { value: userName, setter: setUserName, placeholder: "Enter Your Username" },
          { value: bio, setter: setBio, placeholder: "Bio" },
          { value: profession, setter: setProfession, placeholder: "Profession" },
          { value: gender, setter: setGender, placeholder: "Gender" },
        ].map((field, idx) => (
          <input
            key={idx}
            type="text"
            className="w-full h-14 bg-[#1c1c1c] border border-gray-700 rounded-2xl text-white font-medium px-4 outline-none placeholder-gray-400 focus:border-blue-500 transition-all"
            placeholder={field.placeholder}
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
          />
        ))}
      </div>

      {/* Save Button */}
      <button
        className="w-full max-w-[400px] h-12 bg-blue-500 text-white font-semibold rounded-2xl flex justify-center items-center hover:bg-blue-600 transition-all"
        onClick={handleEditProfile}
        disabled={loading}
      >
        {loading ? <ClipLoader size={24} color="white" /> : "Save Profile"}
      </button>
    </div>
  );
}

export default EditProfile;
