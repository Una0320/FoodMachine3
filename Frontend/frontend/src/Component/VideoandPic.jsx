// VideoandPic.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import VideoStream from './VideoStream';
import SwiperCom from './SwiperCom';

import '../CSS/Dashboard.css'
import '../CSS/Streaming.css'
// import Swiper core and required modules
// import { Swiper, SwiperSlide } from 'swiper/react';
// import Swiper from 'react-id-swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// import required modules
// import { EffectCoverflow, Pagination } from 'swiper/modules';
import ReactIdswiper from "react-id-swiper";


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

    // Swiper 輪播圖片參數
    
    const swiperParams = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            depth: 10,
            rotate: 0,
            stretch: 0,
            slideShadows: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    };
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

    const renderSwiperSlides = () => {
        return historyIndex.map((item, index) => (
            <SwiperSlide key={index} className='swiper-slide'>
                <div className='card'>
                    <img src={`http://127.0.0.1:8000/pic/${item}`} alt={`Slide ${index}`} className='card_img' />
                </div>
            </SwiperSlide>
        ));
    };

    return (
        <div className="up_left" id="box1">
            {/* <button className='leftbtn' onClick={() => handleArrowClick('left')}>{'<'}</button> */}
            
            <ReactIdswiper {...swiperParams}>
                <div style={{ backgroundImage:'url(http://lorempixel.com/600/600/nature/3)' }}>
                <img src={`http://127.0.0.1:8000/pic/${historyIndex[currentShow]}`}></img></div>
                <div style={{ backgroundImage:'url(http://lorempixel.com/600/600/nature/4)' }}>
                <img src={`http://127.0.0.1:8000/pic/${historyIndex[currentShow]}`}></img>
                </div>
            </ReactIdswiper>
            {/* <SwiperCom items={historyIndex}></SwiperCom> */}
            {/* {currentShow === 0 && (
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
            )} */}

            {/* <button className='rightbtn' onClick={() => handleArrowClick('right')}>{'>'}</button> */}

            
        </div>
    );
};

export default VideoandPic;