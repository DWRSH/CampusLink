// MessageArea.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { LuImage } from "react-icons/lu";
import { IoMdSend } from "react-icons/io";
import dp from "../assets/dp.webp";
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMessages } from '../redux/messageSlice';

function MessageArea() {
  const { selectedUser, messages } = useSelector(state => state.message);
  const { userData } = useSelector(state => state.user);
  const { socket } = useSelector(state => state.socket);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const imageInput = useRef();

  // Handle image selection
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMessages([...messages, result.data]));
      setInput("");
      setBackendImage(null);
      setFrontendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all messages on mount
  const getAllMessages = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/message/getAll/${selectedUser._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMessages();
  }, [selectedUser]);

  // Listen for incoming socket messages
  useEffect(() => {
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });

    return () => socket?.off("newMessage");
  }, [messages, socket]);

  return (
    <div className="w-full h-[100vh] bg-[#121212] relative flex flex-col">
      
      {/* Header */}
      <div className="w-full flex items-center gap-4 px-4 py-3 fixed top-0 z-50 bg-[#121212] border-b border-gray-800">
        <MdOutlineKeyboardBackspace
          className="text-white w-6 h-6 cursor-pointer"
          onClick={() => navigate(`/`)}
        />
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 border-2 border-gray-700 rounded-full overflow-hidden cursor-pointer"
            onClick={() => navigate(`/profile/${selectedUser.userName}`)}
          >
            <img src={selectedUser.profileImage || dp} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="text-white">
            <div className="font-semibold">{selectedUser.userName}</div>
            <div className="text-sm text-gray-400">{selectedUser.name}</div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-auto px-6 pt-20 pb-32 flex flex-col gap-6">
        {messages?.map((mess, index) =>
          mess.sender === userData._id
            ? <SenderMessage key={index} message={mess} />
            : <ReceiverMessage key={index} message={mess} />
        )}
      </div>

      {/* Message Input */}
      <div className="w-full h-20 fixed bottom-0 flex justify-center items-center bg-[#121212] z-50 border-t border-gray-800 px-4">
        <form
          className="w-full max-w-[800px] h-14 rounded-full bg-[#1a1c1c] flex items-center gap-3 px-4 relative"
          onSubmit={handleSendMessage}
        >
          {frontendImage && (
            <div className="w-24 h-24 absolute top-[-90px] right-2 rounded-2xl overflow-hidden">
              <img src={frontendImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={imageInput}
            hidden
            onChange={handleImage}
          />

          <input
            type="text"
            placeholder="Message"
            className="flex-1 h-full bg-transparent text-white text-base outline-none placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div onClick={() => imageInput.current.click()}>
            <LuImage className="w-7 h-7 text-white cursor-pointer" />
          </div>

          {(input || frontendImage) && (
            <button
              type="submit"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center cursor-pointer"
            >
              <IoMdSend className="w-6 h-6 text-white" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default MessageArea;
