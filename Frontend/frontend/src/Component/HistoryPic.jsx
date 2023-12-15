// HistoryPic.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import '../CSS/HistoryPic.css'

const HistoryPic = () => {

    //Today's date
    let objectDate = new Date();
    let day = objectDate.getDate() - 1;
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day;

    const [data, setdata] = useState([]);
    const [imageIndexes, setImageIndexes] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fetchGrowPic = async () => {
        try {
            const response = await fetch(
                `http://192.168.1.213:8000/boxgrowin/1/?start_date=${fulldate}`);

            if (response.ok) {
                const jsonData = await response.json();
                console.log(jsonData);
                setdata(jsonData);
                setCurrentImageIndex(jsonData[0].cur_Image)
                // 提取 cur_Image 值並設置到新的陣列
                const indexes = jsonData.map(item => item.cur_Image);
                setImageIndexes(indexes);

            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    useEffect(() =>{
        fetchGrowPic();
    }, []);

    const handleScroll = (e) => {
        const element = e.target;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const scrollPercentage = (element.scrollTop / totalHeight) * 100;
        const newIndex = Math.floor((scrollPercentage / 100) * (imageIndexes.length - 1));
        setCurrentImageIndex(imageIndexes[newIndex]);
    };

    return (
        <div className="history-pic-container">
            <div className="header">
                <h2>History Picture</h2>
                <button onClick={() => window.history.back()}>Go Back</button>
            </div>
            <div className="content-container">
                <div className="current-image">
                    <img src={`http://127.0.0.1:8000/pic/${currentImageIndex}`} alt={`History Pic ${currentImageIndex + 1}`} />
                </div>
                <div className="history-scroll" onScroll={handleScroll}>
                    {data.map((item, index) => (
                        <img key={index} src={`http://127.0.0.1:8000/pic/${item.cur_Image}`} alt={`History Pic ${index + 1}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryPic;
