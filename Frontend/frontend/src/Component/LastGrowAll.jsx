// LastGrowAll.jsx
import React, { useState, useEffect } from 'react';
import '../CSS/Dashboard.css'

const LastGrowAll = ({ socket, boxId }) => {

    //Today's date
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day;
    const [data, setdata] = useState([]);
    const [outdata, setoutdata] = useState([]);

    const fetchINdata = async (boxId) => {
        // -----------------growth info-------------------
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/boxgrowin/${boxId}/?start_date=${fulldate}`
            );

            if (response.ok) {
                const jsonData = await response.json();
                setdata(jsonData[0]);
                console.log(jsonData[0]);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const fetchOUTdata = async (boxId) => {
        // -----------------growth info-------------------
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/boxgrowout/?box_id=${boxId}&start_date=${fulldate}`
            );

            if (response.ok) {
                const jsonData = await response.json();
                setoutdata(jsonData[0]);
                // console.log(jsonData);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() =>{
        fetchINdata(boxId);
        fetchOUTdata(boxId);
        
        function ngrowout_update() {
            console.log("N-growout update");
            fetchOUTdata(boxId);
        }
        
        function ngrowin_update() {
            console.log("N-growin update");
            fetchINdata(boxId);
        }

        // 移除之前的 ngrowout_update 事件監聽器
        socket.off("ngrowout_update");
        socket.on("ngrowout_update", ngrowout_update);

        socket.off("ngrowin_update")
        socket.on("ngrowin_update", ngrowin_update);
    }, [boxId]);

    return(
        <>
            <h1 className='up_right_title'> {data.timestamp && data.timestamp.replace("T", " ")}</h1>
            <div className='up_right_btnArea'>
                {/* Data buttons */}
                {data &&
                    <>
                    <button onClick={() => handleButtonClick(index)}>{data.luminance || ''}</button>
                    <button onClick={() => handleButtonClick(index)}>{data.airtemp || ''}</button>
                    <button onClick={() => handleButtonClick(index)}>{data.humidity || ''}</button>
                    <button onClick={() => handleButtonClick(index)}>{data.sunlong || ''}</button>
                    </>
                }

                {/* Outdata buttons */}
                {outdata ?
                    (<>
                    <button onClick={() => handleButtonClick(index)}>{outdata.watertemp || ''}</button>
                    <button onClick={() => handleButtonClick(index)}>{outdata.humidity || ''}</button>
                    <button onClick={() => handleButtonClick(index)}>{outdata.airtemp || ''}</button>
                    <button onClick={() => handleButtonClick(index)}>{outdata.ph || ''}</button>
                    <button onClick={() => handleButtonClick(index)}>{outdata.ec || ''}</button>
                    <button onClick={() => handleButtonClick(index)}>{outdata.co2 || ''}</button>
                    </>) : 
                    (
                        <>
                    <button onClick={() => handleButtonClick(index)}>{''}</button>
                    <button onClick={() => handleButtonClick(index)}>{''}</button>
                    <button onClick={() => handleButtonClick(index)}>{''}</button>
                    <button onClick={() => handleButtonClick(index)}>{''}</button>
                    <button onClick={() => handleButtonClick(index)}>{''}</button>
                    <button onClick={() => handleButtonClick(index)}>{''}</button>
                    </>
                    )
                }
            </div>
        </>
    );
};

export default LastGrowAll;
