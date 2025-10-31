// SenderMessage.jsx
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaCheck, FaCheckDouble } from 'react-icons/fa'; // ✅ Icons for sent/seen

function SenderMessage({ message }) {
  const { userData } = useSelector(state => state.user);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message.message, message.image]);

  return (
    <div
      ref={scrollRef}
      className='relative w-fit max-w-[60%] bg-gradient-to-br from-purple-600 to-pink-500 rounded-t-2xl rounded-bl-2xl rounded-br-none px-4 py-2 ml-auto flex flex-col gap-2 shadow-lg'
    >
      {/* Image */}
      {message.image && (
        <img
          src={message.image}
          alt="message"
          className='h-[200px] object-cover rounded-xl shadow-sm'
        />
      )}

      {/* Text */}
      {message.message && (
        <div className='text-white text-[16px] break-words'>
          {message.message}
        </div>
      )}

      {/* Seen Indicator */}
      <div className="flex justify-end mt-1">
        {message.seen ? (
          <FaCheckDouble className="text-blue-400 text-xs" title="Seen" />
        ) : (
          <FaCheck className="text-white text-xs opacity-70" title="Sent" />
        )}
      </div>

      {/* Sender Profile Icon */}
      <div className='w-8 h-8 rounded-full overflow-hidden absolute -right-5 -bottom-5 border-2 border-gray-700'>
        <img
          src={userData?.profileImage}
          alt="sender"
          className='w-full h-full object-cover'
        />
      </div>
    </div>
  );
}

export default SenderMessage;
