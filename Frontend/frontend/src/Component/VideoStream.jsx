// VideoStream.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import '../CSS/Streaming.css'

const VideoStream = ({ streamUrl }) => {
    return (
        // <div className='videobox'>
            <iframe
                title="video-stream"
                style={{ width: '640px', height: '480px' }}
                src={streamUrl}
                frameBorder="0"
                allowFullScreen="true"
            ></iframe>
        // </div>
    );
};

export default VideoStream;
