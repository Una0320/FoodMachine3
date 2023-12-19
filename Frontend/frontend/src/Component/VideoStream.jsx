// VideoStream.jsx
import React from 'react';
import { useEffect, useState } from 'react';

const VideoStream = ({ streamUrl }) => {
    return (
        // <div>
            <iframe
                title="video-stream"
                style={{ width: '100%', height: '100%', minWidth: 'min-content', minHeight: 'min-content' }}
                src={streamUrl}
                frameBorder="0"
                allowFullScreen
            ></iframe>
        // </div>
    );
};

export default VideoStream;
