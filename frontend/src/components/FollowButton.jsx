// FollowButton.jsx
import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { toggleFollow } from '../redux/userSlice'

function FollowButton({ targetUserId, tailwind, onFollowChange }) {
    const { following } = useSelector(state => state.user)
    const isFollowing = following.includes(targetUserId)
    const dispatch = useDispatch()

    const handleFollow = async () => {
        try {
            await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`, { withCredentials: true })
            
            // Call optional callback if provided
            if (onFollowChange) onFollowChange()

            // Update local redux state
            dispatch(toggleFollow(targetUserId))
        } catch (error) {
            console.error("Error following/unfollowing user:", error)
        }
    }

    return (
        <button
            className={`${tailwind} ${
                isFollowing
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-blue-600 text-white hover:bg-blue-500"
            } transition-colors duration-200 font-semibold px-4 py-2 rounded-xl`}
            onClick={handleFollow}
        >
            {isFollowing ? "Following" : "Follow"}
        </button>
    )
}

export default FollowButton
