// Search.jsx
import React, { useEffect, useState } from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dp from "../assets/dp.webp";
import { serverUrl } from '../App';

function Search() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [searchData, setSearchData] = useState([]);

    // Debounce input to prevent excessive API calls
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (input) handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [input]);

    const handleSearch = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/search?keyWord=${input}`, { withCredentials: true });
            setSearchData(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='w-full min-h-[100vh] bg-black flex flex-col items-center gap-[20px]'>
            {/* Header */}
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] absolute top-0'>
                <MdOutlineKeyboardBackspace
                    className='text-white cursor-pointer w-[25px] h-[25px]'
                    onClick={() => navigate(`/`)}
                />
            </div>

            {/* Search Bar */}
            <div className='w-full h-[80px] flex items-center justify-center mt-[80px]'>
                <div className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]'>
                    <FiSearch className='w-[18px] h-[18px] text-white' />
                    <input
                        type="text"
                        placeholder='Search...'
                        className='w-full h-full outline-none rounded-full px-[20px] text-white text-[18px]'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                </div>
            </div>

            {/* Search Results */}
            <div className='w-full flex flex-col items-center gap-[10px] mt-[20px]'>
                {input ? (
                    searchData?.map((user) => (
                        <div
                            key={user._id}
                            className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-white flex items-center gap-[20px] px-[5px] cursor-pointer hover:bg-gray-200'
                            onClick={() => navigate(`/profile/${user.userName}`)}
                        >
                            <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                                <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                            </div>
                            <div className='text-black text-[18px] font-semibold flex flex-col'>
                                <span>{user.userName}</span>
                                <span className='text-[14px] text-gray-400'>{user.name}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-[30px] text-gray-700 font-bold mt-[50px]'>Search Here...</div>
                )}
            </div>
        </div>
    );
}

export default Search;
