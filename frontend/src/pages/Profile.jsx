// Profile.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData, setUserData } from '../redux/userSlice';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import dp from "../assets/dp.webp";
import Nav from '../components/Nav';
import FollowButton from '../components/FollowButton';
import Post from '../components/Post';
import { setSelectedUser } from '../redux/messageSlice';
import { serverUrl } from '../App';

function Profile() {
    const { userName } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [postType, setPostType] = useState("posts");

    const { profileData, userData } = useSelector(state => state.user);
    const { postData } = useSelector(state => state.post);

    const isOwnProfile = profileData?._id === userData?._id;

    // Fetch profile data
    const handleProfile = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/getProfile/${userName}`, { withCredentials: true });
            dispatch(setProfileData(result.data));
        } catch (error) {
            console.log(error);
        }
    };

    // Logout handler
    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleProfile();
    }, [userName, dispatch]);

    return (
        <div className='w-full min-h-screen bg-black'>
            {/* Header */}
            <div className='w-full h-[80px] flex justify-between items-center px-[30px] text-white'>
                <MdOutlineKeyboardBackspace
                    className='text-white cursor-pointer w-[25px] h-[25px]'
                    onClick={() => navigate("/")}
                />
                <div className='font-semibold text-[20px]'>{profileData?.userName}</div>
                {isOwnProfile && (
                    <div className='font-semibold cursor-pointer text-[20px] text-blue-500' onClick={handleLogOut}>
                        Log Out
                    </div>
                )}
            </div>

            {/* Profile Info */}
            <div className='w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center'>
                <div className='w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileData?.profileImage || dp} alt="" className='w-full object-cover' />
                </div>
                <div>
                    <div className='font-semibold text-[22px] text-white'>{profileData?.name}</div>
                    <div className='text-[17px] text-[#ffffffe8]'>{profileData?.profession || "New User"}</div>
                    <div className='text-[17px] text-[#ffffffe8]'>{profileData?.bio}</div>
                </div>
            </div>

            {/* Stats */}
            <div className='w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-white'>
                <div>
                    <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.posts.length}</div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Posts</div>
                </div>

                {/* Followers */}
                <div>
                    <div className='flex items-center justify-center gap-[20px]'>
                        <div className='flex relative'>
                            {profileData?.followers?.slice(0, 3).map((user, index) => (
                                <div key={user._id} className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${index > 0 ? `absolute left-[${index * 9}px]` : ""}`}>
                                    <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                            ))}
                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.followers.length}</div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Followers</div>
                </div>

                {/* Following */}
                <div>
                    <div className='flex items-center justify-center gap-[20px]'>
                        <div className='flex relative'>
                            {profileData?.following?.slice(0, 3).map((user, index) => (
                                <div key={user._id} className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${index > 0 ? `absolute left-[${index * 10}px]` : ""}`}>
                                    <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                            ))}
                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.following.length}</div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Following</div>
                </div>
            </div>

            {/* Actions */}
            <div className='w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]'>
                {isOwnProfile ? (
                    <button
                        className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl'
                        onClick={() => navigate("/editprofile")}
                    >
                        Edit Profile
                    </button>
                ) : (
                    <>
                        <FollowButton
                            tailwind='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl'
                            targetUserId={profileData?._id}
                            onFollowChange={handleProfile}
                        />
                        <button
                            className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl'
                            onClick={() => {
                                dispatch(setSelectedUser(profileData));
                                navigate("/messageArea");
                            }}
                        >
                            Message
                        </button>
                    </>
                )}
            </div>

            {/* Posts */}
            <div className='w-full min-h-[100vh] flex justify-center'>
                <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[100px]'>
                    
                    {isOwnProfile && (
                        <div className='w-[90%] max-w-[500px] h-[80px] bg-white rounded-full flex justify-center items-center gap-[10px]'>
                            {["posts", "saved"].map((type) => (
                                <div
                                    key={type}
                                    className={`${postType === type ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
                                    onClick={() => setPostType(type)}
                                >
                                    {type === "posts" ? "Posts" : "Saved"}
                                </div>
                            ))}
                        </div>
                    )}

                    <Nav />

                    {/* Posts rendering */}
                    {postData.map((post) => {
                        if (postType === "posts" && post.author?._id === profileData?._id) return <Post key={post._id} post={post} />;
                        if (postType === "saved" && isOwnProfile && userData.saved.includes(post._id)) return <Post key={post._id} post={post} />;
                        if (!isOwnProfile && post.author?._id === profileData?._id) return <Post key={post._id} post={post} />;
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}

export default Profile;
