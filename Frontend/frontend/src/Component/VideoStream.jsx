// VideoStream.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import '../CSS/Streaming.css'

const VideoStream = ({ streamUrl }) => {
    return (
        // <div className='videobox'>
            <iframe
                title="video-stream"
                className="card__stream"
                src={streamUrl}
                alt="video-stream"
            />
        // </div>
    );
};

export default VideoStream;
