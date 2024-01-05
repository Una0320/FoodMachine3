// VideoandPic.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import VideoStream from './VideoStream';
import '../CSS/Dashboard.css'
import '../CSS/Streaming.css'

const VideoandPic = ({ socket , boxId}) =>{
    //Today's date
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day;

    const [historyIndex, setHistoryIndex] = useState([]);
    const [data, setdata] = useState([]);
    const [error, setError] = useState(null);

    const [slideDirection, setSlideDirection] = useState(''); 
    //目前up_left要顯示的畫面
    //0 -> video streaming ; 1~data.length -> growth image
    const [currentShow, setcurrentShow] = useState(0);

    const fetchGrowPic = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/boxgrowin/${boxId}/?start_date=${fulldate}&attributes=timestamp,cur_Image`);

            if (response.ok) {
                const jsonData = await response.json();
                console.log(jsonData);
                setdata(jsonData);
                // setCurrentImageIndex(jsonData[0].cur_Image);

                // 提取 cur_Image 值並設置到新的陣列
                const indexes = jsonData.map(item => item.cur_Image);
                setHistoryIndex(indexes);
                console.log(historyIndex);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() => {
        fetchGrowPic();
    }, []); // 只在組件 mount 時執行

    const handleArrowClick = (direction) => {
        if (direction === 'left') {
            setcurrentShow((prevShow) => (prevShow > 0 ? prevShow - 1 : prevShow));
            setSlideDirection(direction); // 设置 slideDirection
        } else {
          setcurrentShow((prevShow) => (prevShow < data.length ? prevShow + 1 : prevShow));
          setSlideDirection(direction); // 设置 slideDirection
        }
    };

    return (
        <div className="up_left" id="box1">
            <button className='leftbtn' onClick={() => handleArrowClick('left')}>{'<'}</button>
            
            {currentShow === 0 && (
                <>
                <VideoStream
                    streamUrl={"http://192.168.1.201:8080/javascript_simple.html"}
                    className={`streaming`}
                />
                <img src={`http://127.0.0.1:8000/pic/${historyIndex[currentShow]}`}
                className='behind-img '></img>
                <img src={`http://127.0.0.1:8000/pic/${historyIndex[currentShow+1]}`}
                className='behind-img2'></img>
                </>
            )}

            {currentShow > 0 && (
                <>
                <img
                    src={`http://127.0.0.1:8000/pic/${historyIndex[currentShow - 1]}`}
                    className={`grow-img`}
                />
                <img src={`http://127.0.0.1:8000/pic/${historyIndex[currentShow]}`}
                    className='behind-img '></img>
                <img src={`http://127.0.0.1:8000/pic/${historyIndex[currentShow+1]}`}
                    className='behind-img2'></img>
                </>
            )}

            <button className='rightbtn' onClick={() => handleArrowClick('right')}>{'>'}</button>

            
        </div>
    );
};

export default VideoandPic;