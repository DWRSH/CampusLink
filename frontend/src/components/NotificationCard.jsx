// NotificationCard.jsx
import React from 'react'
import dp from "../assets/dp.webp"

function NotificationCard({ noti }) {
  return (
    <div className={`w-full flex justify-between items-center p-3 min-h-[60px] bg-gray-900 rounded-xl shadow-md hover:bg-gray-800 transition-colors duration-200`}>
      
      {/* Sender Info */}
      <div className='flex gap-3 items-center'>
        <div className='w-12 h-12 border-2 border-gray-700 rounded-full overflow-hidden flex-shrink-0'>
          <img src={noti.sender?.profileImage || dp} alt="sender" className='w-full h-full object-cover'/>
        </div>
        <div className='flex flex-col'>
          <h1 className='text-white text-sm font-semibold'>{noti.sender?.userName}</h1>
          <p className='text-gray-300 text-xs truncate max-w-[200px]'>{noti.message}</p>
        </div>
      </div>

      {/* Media Preview */}
      <div className='w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-700 flex-shrink-0'>
        {noti.loop ? (
          <video src={noti.loop?.media} muted className='h-full w-full object-cover' loop />
        ) : noti.post ? (
          noti.post.mediaType === "image" ? (
            <img src={noti.post.media} className='h-full w-full object-cover' alt="post"/>
          ) : (
            <video src={noti.post.media} muted loop className='h-full w-full object-cover' />
          )
        ) : null}
      </div>
    </div>
  )
}

export default NotificationCard
