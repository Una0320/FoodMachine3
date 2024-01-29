import React, { useState } from 'react';
import ReactIdSwiper from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../CSS/Swiper.css'
// import 'swiper/css/swiper.css';
// import 'swiper/css/effect-coverflow/effect-coverflow.min.css'; // 這裡是新增的 coverflow 的樣式

const SwiperCom = ({ items }) => {
    const [index, setIndex] = useState(0);

    const handlePrev = () => setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    const handleNext = () => setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

    // Swiper 的相關參數
    const params = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 3, // 顯示的幻燈片數量
        coverflowEffect: {
            rotate: 30, // 旋轉角度
            stretch: 10, // 拉伸。值越大，"凹槽"越小
            depth: 60, // 透視度
            modifier: 2, // 可以使用 2D 或 3D 的效果
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        on: {
            slideChange: () => {
                // 切換幻燈片時的回調
                // 您可以在這裡做一些額外的操作
            },
        },
    };

    return (
        <div className="swiper-container">
            <Swiper {...params}>
                {items.map((item, i) => (
                    <SwiperSlide key={i}>
                        <div
                            className={`swiper-item ${i === index ? 'active' : ''}`}
                            onClick={() => setIndex(i)}
                        >
                            <img src={`http://127.0.0.1:8000/pic/${item}`} alt={`Slide ${i}`} />
                        </div>
                    </SwiperSlide>
                ))}
                <div className="swiper-pagination"></div>
            </Swiper>
            <button onClick={handlePrev}>&lt;</button>
            <button onClick={handleNext}>&gt;</button>
        </div>
    );
};

export default SwiperCom;
