// VideoandPic.jsx
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import VideoStream from './VideoStream';
// import SwiperCom from './SwiperCom';

import '../CSS/Dashboard.css'
import '../CSS/Streaming.css'
// import Swiper core and required modules
import Swiper from 'swiper';
import { Navigation, Pagination, EffectCards, A11y, EffectCoverflow } from 'swiper/modules';
// Swiper.use([Navigation]);

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';


const VideoandPic = ({ socket , boxId, url}) =>{
    //Today's date
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day;

    const [historyIndex, setHistoryIndex] = useState([]);
    const [data, setdata] = useState([]);
    const [error, setError] = useState(null);
    
    // Swiper 實例的參考
    const swiperRef = useRef(null);

    const initSwiper = () => {
        swiperRef.current  = new Swiper('#mySwiper', {
            effect: 'coverflow',
            slidesPerView: 'auto',
            grabCursor:true,
            centeredSlides: true,
            speed:200,
            coverflowEffect: {
                depth: 760,
                rotate: 0,
                stretch: 200,
                modifier:1,
                slideShadows: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                init:true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            modules:[Navigation, EffectCoverflow, Pagination, EffectCards]
        });
    };
    // Swiper 輪播圖片參數
    useEffect(() => {
    
        initSwiper();
    
        return () => {
            // 在組件卸載時銷毀 Swiper 實例
            if (swiperRef.current) {
                swiperRef.current.destroy();
            }
            // // 在組件卸載時銷毀 Swiper 實例
            // const swiperInstance = document.querySelector('mySwiper').swiper;
            // if (swiperInstance) {
            //     swiperInstance.destroy();
            // }
        };
    }, []); // 注意這裡的空依賴，表示只在組件創建和銷毀時執行一次

    useEffect(() => {
        // 提取 cur_Image 值並設置到新的陣列
        const indexes = data.map(item => item.cur_Image);
        setHistoryIndex(indexes);
    }, [data]); // 這裡根據 data 變化更新 historyIndex

    
    const fetchGrowPic = async (boxId) => {
        try {
            const response = await fetch(`${url}/boxgrowin/${boxId}/?start_date=${fulldate}&attributes=timestamp,cur_Image`);

            if (response.ok) {
                const jsonData = await response.json();
                console.log(jsonData);
                // 提取 cur_Image 值並設置到新的陣列
                const indexes = jsonData.map(item => item.cur_Image);

                setdata(jsonData);
                setHistoryIndex(indexes);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() => {
        fetchGrowPic(boxId);

        function ngrowin_updateVP() {
            console.log("N-growin_VideoPic");
            fetchGrowPic(boxId);
            // 在事件發生時，更新 Swiper 實例
            if (swiperRef.current) {
                swiperRef.current.update();
            }
        }
        // socket.off("ngrowin_update")
        socket.on("ngrowin_update", ngrowin_updateVP);

        return () => {
            socket.off("ngrowin_update")
        };
    }, [boxId]);

    const renderSwiperSlides = () => {
        return(
            <>
            <div className="swiper-slide">
                <div className="cardstream">
                    <iframe
                        src={"http://192.168.1.201:8080/javascript_simple.html"}
                        className="card__stream"
                    />
                </div>
            </div>
            {/* 下面是動態生成的圖片 slides */}
            {
                historyIndex.map((item, index) => (
                <div key={index} className="swiper-slide">
                    <div className="card">
                        <img
                            src={`http://192.168.1.213:8000/pic/${item}`}
                            alt=""
                            className="card__img"
                            title = {item}
                        />
                    </div>
                </div>
            ))
            }
            </>
        )
    };

    return (
        <div className="up_left" id="box1">
            <div className="swiper-button-prev">
                <img src='/leftarrow.png'></img>
            </div>
            <div id="mySwiper" className="swiper-container">
                <div className="swiper-wrapper">
                    {/* <div className="swiper-slide">
                        <div className="card">
                            <iframe
                                src={"http://192.168.1.201:8080/javascript_simple.html"}
                                className="card__stream"
                            />
                        </div>
                    </div> */}
                    <>
                        {historyIndex?renderSwiperSlides():renderSwiperSlides()}
                    </>
                </div>
            </div>
            <div className="swiper-button-next">
                <img src='/rightarrow.png'></img>
            </div>
            
        </div>
    );
};

export default VideoandPic;