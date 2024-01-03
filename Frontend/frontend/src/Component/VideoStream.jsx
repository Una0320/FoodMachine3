// VideoStream.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import '../CSS/Streaming.css'

const VideoStream = ({ streamUrl }) => {
    return (
        // <div className='videobox'>
            <iframe
                title="video-stream"
                className="stream-img" // 添加一个类名，用于设置样式
                src={streamUrl}
                alt="video-stream"
            />
        // </div>
    );
};

export default VideoStream;
