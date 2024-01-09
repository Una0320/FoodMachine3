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

    //line chart visibility
    const {chartVisibilityMap, toggleChartVisibility} = useCtrline()

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

        socket.off("ngrowin_update")
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
                        <button className={`${chartVisibilityMap['luminance'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('luminance')}>Brightness {data.luminance || ''}</button>
                        <button className={`${chartVisibilityMap['inairtemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('inairtemp')}>Airtemp {data.airtemp || ''}</button>
                        <button className={`${chartVisibilityMap['inhumidity'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('inhumidity')}>Humidity {data.humidity || ''}</button>
                        <button className={`${chartVisibilityMap['sunlong'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('sunlong')}>Sunshine Duration {data.sunlong || ''}</button>
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
                                onClick={() => toggleChartVisibility('watertemp')}>Out watertemp {Math.round(outdata.watertemp*100)/100 || ''}</button>
                        <button className={`${chartVisibilityMap['outhumidity'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('outhumidity')}>Out Humidity {Math.round(outdata.humidity*100)/100 || ''}</button>
                        <button className={`${chartVisibilityMap['outairtemp'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('outairtemp')}>Out Airtemp {Math.round(outdata.airtemp*100)/100 || ''}</button>
                        <button className={`${chartVisibilityMap['ph'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('ph')}>pH<br/>{Math.round(outdata.ph*100)/100 || ''}</button>
                        <button className={`${chartVisibilityMap['ec'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('ec')}>EC {outdata.ec || ''}</button>
                        <button className={`${chartVisibilityMap['co2'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('co2')}>CO2 {roundDecimal(outdata.co2,3) || ''}</button>
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
                                onClick={() => toggleChartVisibility('ec')}>EC {''}</button>
                        <button className={`${chartVisibilityMap['co2'] ? 'btn-true' : 'btn-false'}`}
                                onClick={() => toggleChartVisibility('co2')}>CO2 {''}</button>
                        </>
                    )
                }
            </div>
        </>
    );
};

export default LastGrowAll;
