// ReceiverMessage.jsx
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

function ReceiverMessage({ message }) {
  const { selectedUser } = useSelector(state => state.message);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message.message, message.image]);

  return (
    <div
      ref={scrollRef}
      className='relative w-fit max-w-[60%] bg-gray-800 rounded-t-2xl rounded-br-2xl rounded-bl-none px-4 py-2 left-0 flex flex-col gap-2 shadow-md'
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

      {/* Profile Icon */}
      <div className='w-8 h-8 rounded-full overflow-hidden absolute -left-5 -bottom-5 border-2 border-gray-700'>
        <img
          src={selectedUser?.profileImage}
          alt="sender"
          className='w-full h-full object-cover'
        />
      </div>
    </div>
  );
}

export default ReceiverMessage;
