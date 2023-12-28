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

    //Fetch data
    const [data, setdata] = useState([]);
    const [outdata, setoutdata] = useState([]);

    //line chart visibility
    // 狀態用來追蹤 data buttons 的顯示和隱藏
    const [chartDataVisibility, setChartDataVisibility] = useState({
        luminance: true,
        airtemp: true,
        humidity: true,
        sunlong: true,
    });

    // 狀態用來追蹤 out data buttons 的顯示和隱藏
    const [outChartDataVisibility, setOutChartDataVisibility] = useState({
        watertemp: true,
        humidity: true,
        airtemp: true,
        ph: true,
        ec: true,
        co2: true,
    });

    // 處理 data buttons 和 out data buttons 的點擊事件
    const handleButtonClick = (index) => {
        // 處理 data buttons
        if (data) {
            switch (index) {
                case 0:
                    setChartDataVisibility({ ...chartDataVisibility, luminance: !chartDataVisibility.luminance });
                    console.log(chartDataVisibility)
                    break;
                case 1:
                    setChartDataVisibility({ ...chartDataVisibility, airtemp: !chartDataVisibility.airtemp });
                    break;
                case 2:
                    setChartDataVisibility({ ...chartDataVisibility, humidity: !chartDataVisibility.humidity });
                    break;
                case 3:
                    setChartDataVisibility({ ...chartDataVisibility, sunlong: !chartDataVisibility.sunlong });
                    break;
                default:
                    break;
            }
        } else if (outdata) {
            // 處理 out data buttons
            switch (index) {
                case 0:
                    setOutChartDataVisibility({ ...outChartDataVisibility, watertemp: !outChartDataVisibility.watertemp });
                    break;
                case 1:
                    setOutChartDataVisibility({ ...outChartDataVisibility, humidity: !outChartDataVisibility.humidity });
                    break;
                case 2:
                    setOutChartDataVisibility({ ...outChartDataVisibility, airtemp: !outChartDataVisibility.airtemp });
                    break;
                case 3:
                    setOutChartDataVisibility({ ...outChartDataVisibility, ph: !outChartDataVisibility.ph });
                    break;
                case 4:
                    setOutChartDataVisibility({ ...outChartDataVisibility, ec: !outChartDataVisibility.ec });
                    break;
                case 5:
                    setOutChartDataVisibility({ ...outChartDataVisibility, co2: !outChartDataVisibility.co2 });
                    break;
                default:
                    break;
            }
        }
    };

    const fetchINdata = async (boxId) => {
        // -----------------growth info-------------------
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/boxgrowin/${boxId}/?start_date=${fulldate}`
            );

            if (response.ok) {
                const json_inData = await response.json();
                setdata(json_inData[0]);
                console.log(json_inData[0]);
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
                const json_outData = await response.json();
                setoutdata(json_outData[0]);
                // console.log(json_outData);
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
            console.log("N-growin_LastGrow");
            fetchINdata(boxId);
        }

        // 移除之前的 ngrowout_update 事件監聽器
        socket.off("ngrowout_update");
        socket.on("ngrowout_update", ngrowout_update);

        // socket.off("ngrowin_update")
        socket.on("ngrowin_update", ngrowin_update);
        return () => {
            // 在组件卸载时取消事件监听
            socket.off("ngrowin_update")
        };
    }, [boxId]);

    return(
        <>
            {data ? 
                (<h1 className='up_right_title'> {data.timestamp && data.timestamp.replace("T", " ")}</h1>)
                :(<h1> {objectDate.toLocaleTimeString()} </h1>)
            }
            <div className='up_right_btnArea'>
                {/* Data buttons */}
                {data ?
                    (<>
                        <button onClick={() => handleButtonClick(0)}>Brightness {data.luminance || ''}</button>
                        <button onClick={() => handleButtonClick(1)}>airtemp {data.airtemp || ''}</button>
                        <button onClick={() => handleButtonClick(2)}>Humidity {data.humidity || ''}</button>
                        <button onClick={() => handleButtonClick(3)}>Sunshine Duration {data.sunlong || ''}</button>
                    </>) :
                    (
                        <>
                        <button onClick={() => handleButtonClick(index)}>Brightness{''}</button>
                        <button onClick={() => handleButtonClick(index)}>Airtemp{''}</button>
                        <button onClick={() => handleButtonClick(index)}>Humidity{''}</button>
                        <button onClick={() => handleButtonClick(index)}>Sunshine Duration{''}</button>
                        </>
                    )
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
                    <button onClick={() => handleButtonClick(index)}>Watertemp{''}</button>
                    <button onClick={() => handleButtonClick(index)}>Out Humidity{''}</button>
                    <button onClick={() => handleButtonClick(index)}>Out Airtemp{''}</button>
                    <button onClick={() => handleButtonClick(index)}>pH{''}</button>
                    <button onClick={() => handleButtonClick(index)}>EC{''}</button>
                    <button onClick={() => handleButtonClick(index)}>CO2{''}</button>
                    </>
                    )
                }
            </div>
        </>
    );
};

export default LastGrowAll;
