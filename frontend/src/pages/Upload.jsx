// Upload.jsx
import React, { useState, useRef } from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setCurrentUserStory, setStoryData } from '../redux/storySlice';
import { setLoopData } from '../redux/loopSlice';
import { ClipLoader } from 'react-spinners';

function Upload() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const mediaInput = useRef();

    const { postData } = useSelector(state => state.post);
    const { storyData } = useSelector(state => state.story);
    const { loopData } = useSelector(state => state.loop);

    const [uploadType, setUploadType] = useState("post");
    const [frontendMedia, setFrontendMedia] = useState(null);
    const [backendMedia, setBackendMedia] = useState(null);
    const [mediaType, setMediaType] = useState("");
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle media selection
    const handleMedia = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setMediaType(file.type.includes("image") ? "image" : "video");
        setBackendMedia(file);
        setFrontendMedia(URL.createObjectURL(file));
    }

    // Unified upload function
    const handleUpload = async () => {
        if (!backendMedia) return;

        setLoading(true);
        try {
            const formData = new FormData();
            if (uploadType !== "story" && caption) formData.append("caption", caption);
            formData.append("mediaType", mediaType);
            formData.append("media", backendMedia);

            let result;
            if (uploadType === "post") {
                result = await axios.post(`${serverUrl}/api/post/upload`, formData, { withCredentials: true });
                dispatch(setPostData([...postData, result.data]));
            } else if (uploadType === "story") {
                result = await axios.post(`${serverUrl}/api/story/upload`, formData, { withCredentials: true });
                dispatch(setCurrentUserStory(result.data));
            } else { // loop
                result = await axios.post(`${serverUrl}/api/loop/upload`, formData, { withCredentials: true });
                dispatch(setLoopData([...loopData, result.data]));
            }
            navigate("/");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='w-full h-[100vh] bg-black flex flex-col items-center'>
            {/* Header */}
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
                <MdOutlineKeyboardBackspace
                    className='text-white cursor-pointer w-[25px] h-[25px]'
                    onClick={() => navigate(`/`)}
                />
                <h1 className='text-white text-[20px] font-semibold'>Upload Media</h1>
            </div>

            {/* Upload Type Selector */}
            <div className='w-[90%] max-w-[600px] h-[80px] bg-[white] rounded-full flex justify-around items-center gap-[10px]'>
                {["post", "story", "loop"].map((type) => (
                    <div
                        key={type}
                        className={`${uploadType === type ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
                        onClick={() => setUploadType(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                ))}
            </div>

            {/* Media Upload Area */}
            {!frontendMedia ? (
                <div
                    className='w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]'
                    onClick={() => mediaInput.current.click()}
                >
                    <input
                        type="file"
                        accept={uploadType === "loop" ? "video/*" : "image/*,video/*"}
                        hidden
                        ref={mediaInput}
                        onChange={handleMedia}
                    />
                    <FiPlusSquare className='text-white cursor-pointer w-[25px] h-[25px]' />
                    <div className='text-white text-[19px] font-semibold'>Upload {uploadType}</div>
                </div>
            ) : (
                <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]'>
                    {mediaType === "image" ? (
                        <img src={frontendMedia} alt="" className='h-[60%] rounded-2xl' />
                    ) : (
                        <VideoPlayer media={frontendMedia} />
                    )}
                    {uploadType !== "story" && (
                        <input
                            type='text'
                            className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]'
                            placeholder='Write caption'
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                    )}
                </div>
            )}

            {/* Upload Button */}
            {frontendMedia && (
                <button
                    className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[white] mt-[50px] cursor-pointer rounded-2xl'
                    onClick={handleUpload}
                >
                    {loading ? <ClipLoader size={30} color='black' /> : `Upload ${uploadType}`}
                </button>
            )}
        </div>
    );
}

export default Upload;
