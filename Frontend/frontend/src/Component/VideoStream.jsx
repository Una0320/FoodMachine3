// VideoStream.jsx
import React from 'react';
import { useEffect, useState } from 'react';

const VideoStream = ({ streamUrl }) => {
    return (
        <div>
            {/* <h2>Video Stream</h2> */}
            <iframe
                title="video-stream"
                style={{ width: '100%', height: '420px', minWidth: 'min-content', minHeight: 'min-content' }}
                src={streamUrl}
                frameBorder="0"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default VideoStream;
