// VideoStream.jsx
import React from 'react';
import { useEffect, useState } from 'react';

const VideoStream = ({ streamUrl }) => {
    return (
        <div>
            {/* <h2>Video Stream</h2> */}
            <iframe
                title="video-stream"
                width="700"
                height="450"
                src={streamUrl}
                frameBorder="0"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default VideoStream;
