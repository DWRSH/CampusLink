// Story.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setStoryData } from '../redux/storySlice';
import StoryCard from '../components/StoryCard';

function Story() {
    const { userName } = useParams();
    const dispatch = useDispatch();
    const { storyData } = useSelector(state => state.story);
    const [loading, setLoading] = useState(true);

    const handleStory = async () => {
        dispatch(setStoryData(null)); // clear previous story
        setLoading(true);
        try {
            const result = await axios.get(`${serverUrl}/api/story/getByUserName/${userName}`, { withCredentials: true });
            dispatch(setStoryData(result.data[0] || null));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userName) handleStory();
    }, [userName]);

    if (loading) {
        return (
            <div className='w-full h-[100vh] bg-black flex justify-center items-center text-white'>
                Loading Story...
            </div>
        );
    }

    if (!storyData) {
        return (
            <div className='w-full h-[100vh] bg-black flex justify-center items-center text-white'>
                No story available.
            </div>
        );
    }

    return (
        <div className='w-full h-[100vh] bg-black flex justify-center items-center'>
            <StoryCard storyData={storyData} />
        </div>
    );
}

export default Story;
