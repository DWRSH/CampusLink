// Post.jsx
import React, { useEffect, useState } from 'react';
import dp from "../assets/dp.webp";
import VideoPlayer from './VideoPlayer';
import { GoHeart, GoHeartFill, GoBookmarkFill } from "react-icons/go";
import { MdOutlineComment, MdOutlineBookmarkBorder } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import axios from 'axios';
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';

function Post({ post }) {
  const { userData } = useSelector(state => state.user);
  const { postData } = useSelector(state => state.post);
  const { socket } = useSelector(state => state.socket);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, { withCredentials: true });
      const updatedPost = result.data;
      const updatedPosts = postData.map(p => p._id === post._id ? updatedPost : p);
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/post/comment/${post._id}`, { message }, { withCredentials: true });
      const updatedPost = result.data;
      const updatedPosts = postData.map(p => p._id === post._id ? updatedPost : p);
      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  const handleSaved = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/saved/${post._id}`, { withCredentials: true });
      dispatch(setUserData(result.data));
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleLikedPost = (updatedData) => {
      const updatedPosts = postData.map(p => p._id === updatedData.postId ? { ...p, likes: updatedData.likes } : p);
      dispatch(setPostData(updatedPosts));
    };

    const handleCommentedPost = (updatedData) => {
      const updatedPosts = postData.map(p => p._id === updatedData.postId ? { ...p, comments: updatedData.comments } : p);
      dispatch(setPostData(updatedPosts));
    };

    socket.on("likedPost", handleLikedPost);
    socket.on("commentedPost", handleCommentedPost);

    return () => {
      socket.off("likedPost", handleLikedPost);
      socket.off("commentedPost", handleCommentedPost);
    };
  }, [socket, postData, dispatch]);

  return (
    <div className='w-[90%] flex flex-col gap-4 bg-gray-900 text-white rounded-2xl shadow-lg p-4'>
      {/* Header: Author Info */}
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate(`/profile/${post.author?.userName}`)}>
          <div className='w-12 h-12 border-2 border-gray-700 rounded-full overflow-hidden'>
            <img src={post.author?.profileImage || dp} alt="" className='w-full h-full object-cover'/>
          </div>
          <span className='font-semibold truncate'>{post.author?.userName || "Unknown User"}</span>
        </div>
        {userData?._id && post?.author?._id && userData._id !== post.author._id && (
          <FollowButton 
            targetUserId={post.author._id} 
            tailwind='px-4 py-2 bg-black text-white rounded-2xl text-sm hover:bg-gray-700 transition-colors'
          />
        )}
      </div>

      {/* Media: Image or Video */}
      <div className='w-full flex justify-center items-center'>
        {post?.mediaType === "image" ? (
          <img src={post?.media} alt="" className='w-full max-h-[500px] object-cover rounded-2xl' />
        ) : (
          <VideoPlayer media={post.media} />
        )}
      </div>

      {/* Actions: Like, Comment, Save */}
      <div className='flex justify-between items-center mt-2'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            {!post.likes.includes(userData._id) ? 
              <GoHeart className='w-6 h-6 cursor-pointer' onClick={handleLike} /> :
              <GoHeartFill className='w-6 h-6 cursor-pointer text-red-600' onClick={handleLike} />
            }
            <span>{post.likes.length}</span>
          </div>
          <div className='flex items-center gap-1 cursor-pointer' onClick={() => setShowComment(prev => !prev)}>
            <MdOutlineComment className='w-6 h-6' />
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div onClick={handleSaved}>
          {userData.saved.includes(post._id) ? 
            <GoBookmarkFill className='w-6 h-6 cursor-pointer' /> : 
            <MdOutlineBookmarkBorder className='w-6 h-6 cursor-pointer' />
          }
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className='w-full px-1 mt-2'>
          <span className='font-semibold'>{post.author?.userName || "Unknown User"}: </span>
          <span>{post.caption}</span>
        </div>
      )}

      {/* Comments Section */}
      {showComment && (
        <div className='w-full flex flex-col gap-3 mt-2'>
          <div className='flex items-center gap-2 relative'>
            <div className='w-10 h-10 border-2 border-gray-700 rounded-full overflow-hidden'>
              <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover'/>
            </div>
            <input 
              type="text" 
              placeholder='Write a comment...' 
              className='w-full px-2 py-1 rounded bg-gray-800 text-white outline-none' 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
            />
            <button className='absolute right-2' onClick={handleComment}>
              <IoSendSharp className='w-6 h-6' />
            </button>
          </div>

          <div className='flex flex-col gap-2 max-h-64 overflow-auto'>
            {post.comments?.map((com, idx) => (
              <div key={idx} className='flex items-center gap-3 bg-gray-800 p-2 rounded-lg'>
                <div className='w-10 h-10 border-2 border-gray-700 rounded-full overflow-hidden'>
                  <img src={com.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                </div>
                <span>{com.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default Post;
