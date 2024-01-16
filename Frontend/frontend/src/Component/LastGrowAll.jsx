// LastGrowAll.jsx
import React, { useState, useEffect, useContext } from 'react';
import '../CSS/Dashboard.css'
import '../CSS/LastGrowAll.css'
import { useCtrline } from './ChartCtlContext';
import { useContent } from './ContentContext';

const LastGrowAll = ({ socket, boxId }) => {

    //{ socket, boxId }
    //Today's date
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day;

    //Fetch data
    const contentdata = useContent();
    const [data, setdata] = useState([]);
    const [outdata, setoutdata] = useState([]);

    // 新增一個 state 來追蹤選擇的小時
    const [selectedHour, setSelectedHour] = useState(2); // 初始值為 2
    // 滑塊的範圍是2到23，步進值為1
    const minHour = 2;
    const maxHour = 23;

    //line chart visibility
    const {chartVisibilityMap, toggleChartVisibility, updateSelectedHour} = useCtrline()

    let roundDecimal = function (val, precision) {
        return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
    }

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
            console.log("N-growout_LastGrow");
            fetchOUTdata(boxId);
        }
        
        function ngrowin_update() {
            console.log("N-growin_LastGrow");
            fetchINdata(boxId);
        }

        // 移除之前的 ngrowout_update 事件監聽器
        // socket.off("ngrowout_update");
        socket.on("ngrowout_update", ngrowout_update);

        // socket.off("ngrowin_update")
        socket.on("ngrowin_update", ngrowin_update);
        return () => {
            // 在组件卸载时取消事件监听
            socket.off("ngrowin_update");
            socket.off("ngrowout_update");
        };
    }, [boxId]);

    return(
        <>
            {data ? 
                (<h3 className='up_right_title'> {data.timestamp && data.timestamp.replace("T", " ")}</h3>)
                :(<h3 className='up_right_title'> {objectDate.toLocaleTimeString()} </h3>)
            }
            <div className='up_right_btnArea'>
                {/* Data buttons */}
                {data ?
                    (<>
                        <button className={`${chartVisibilityMap['luminance'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('luminance')}>Brightness<br/>{data.luminance || ''}LUX</button>
                        <button className={`${chartVisibilityMap['inairtemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('inairtemp')}>Airtemp {data.airtemp || ''} &#8451;</button>
                        <button className={`${chartVisibilityMap['inhumidity'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('inhumidity')}>Humidity {data.humidity || ''}%</button>
                        <button className={`${chartVisibilityMap['sunlong'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('sunlong')}>Sunshine Duration {data.sunlong || ''}hr</button>
                    </>) :
                    (
                        <>
                        <button className={`${chartVisibilityMap['luminance'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('luminance')}>Brightness {''}</button>
                        <button className={`${chartVisibilityMap['inairtemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('inairtemp')}>Airtemp {''}</button>
                        <button className={`${chartVisibilityMap['inhumidity'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('inhumidity')}>Humidity {''}</button>
                        <button className={`${chartVisibilityMap['sunlong'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('sunlong')}>Sunshine Duration {''}</button>
                        </>
                    )
                }

                {/* Outdata buttons */}
                {outdata ?
                    (
                        <>
                        <button className={`${chartVisibilityMap['watertemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('watertemp')}>Out watertemp {Math.round(outdata.watertemp*100)/100 || ''} &#8451;</button>
                        <button className={`${chartVisibilityMap['outhumidity'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('outhumidity')}>Out Humidity {Math.round(outdata.humidity*100)/100 || ''}%</button>
                        <button className={`${chartVisibilityMap['outairtemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('outairtemp')}>Out Airtemp {Math.round(outdata.airtemp*100)/100 || ''} &#8451;</button>
                        <button className={`${chartVisibilityMap['ph'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('ph')}>pH<br/>{Math.round(outdata.ph*100)/100 || ''}</button>
                        <button className={`${chartVisibilityMap['ec'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('ec')}>EC<br/>{roundDecimal(outdata.ec, 3) || ''} ms/cm</button>
                        <button className={`${chartVisibilityMap['co2'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('co2')}>CO2 {roundDecimal(outdata.co2,3) || ''} ppm</button>
                        </>
                    ) : 
                    (
                        <>
                        <button className={`${chartVisibilityMap['watertemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('watertemp')}>Out Watertemp {''}</button>
                        <button className={`${chartVisibilityMap['outhumidity'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('outhumidity')}>Out Humidity {''}</button>
                        <button className={`${chartVisibilityMap['outairtemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('outairtemp')}>Out Airtemp {''}</button>
                        <button className={`${chartVisibilityMap['ph'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('ph')}>pH {''}</button>
                        <button className={`${chartVisibilityMap['ec'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('ec')}>EC {''} ms/cm</button>
                        <button className={`${chartVisibilityMap['co2'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('co2')}>CO2 {''} ppm</button>
                        </>
                    )
                }
                <button className={`${chartVisibilityMap['hourbtn'] ? 'btn-true' : 'btn-false'}`}
                        onClick={() => toggleChartVisibility('hourbtn')}>Hour</button>
                {/* 使用滑塊來選擇小時 */}
                <input
                        type="range"
                        min={minHour}
                        max={maxHour}
                        value={selectedHour}
                        onChange={(e) => {
                            const hourValue = parseInt(e.target.value, 10);
                            setSelectedHour(hourValue);
                            updateSelectedHour(hourValue); // 更新相應的狀態
                        }}
                    />
                    <span>{selectedHour} 小時</span>
                <button className={`${chartVisibilityMap['daybtn'] ? 'btn-true' : 'btn-false'}`}
                        onClick={() => toggleChartVisibility('daybtn')}>Day</button>
            </div>
        </>
    );
};

export default LastGrowAll;
