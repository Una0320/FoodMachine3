// LineChartCom.jsx
import React, { useState } from 'react';
import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../CSS/LineChartCom.css'
import { useCtrline } from './ChartCtlContext';

const LineChartCom = ({ socket , boxId}) => {

    //Today's date
    const { chartVisibilityMap } = useCtrline();
    const [chartHeight, setChartHeight] = useState(451);
    const [chartdata, setChartdata] = useState([]);
    const [chartoutdata, setChartoutdata] = useState([]);
    const [paraExtremes, setParaExtremes] = useState({});
    const [paraoutExtremes, setParaoutExtremes] = useState({});


    // 時間格式
    const formatDate = (timestamp) => {
        const time = new Date(timestamp);
        const hour = time.getHours();
        const min = (time.getMinutes() === 0) ? '00' : time.getMinutes();
        return `${hour}:${min}`;
    };

    // Database fetch data
    const fetchData = async (boxid, date) => {
        try {
            const attributes = 'timestamp,luminance,airtemp,humidity';
            const encodedURL = `http://127.0.0.1:8000/boxgrowin/${boxid}/?start_date=${date}&attributes=${attributes}`;
    
            const response = await fetch(encodedURL);
            if (response.ok) {
                const jsonData = await response.json();
                const processedData = jsonData.map(entry => ({ ...entry, timestamp: formatDate(entry.timestamp) })).reverse();
                setChartdata(processedData);
                console.log(processedData);
            } else {
                console.log(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    // Database fetch outdata
    const fetchoutData = async ( boxid, date ) => {
        try {

            const attributes = 'timestamp,airtemp,humidity,ph,ec,co2,waterlevel,watertemp,oxygen';
            const encodedURL = `http://127.0.0.1:8000/boxgrowout/?box_id=${boxid}&start_date=${date}&attributes=${attributes}`;
    
            const response = await fetch(encodedURL);
            if (response.ok) {
                const jsonData = await response.json();
                const processedData = jsonData.map(entry => ({ ...entry, timestamp: formatDate(entry.timestamp) })).reverse();
                setChartoutdata(processedData);
                console.log(processedData);
            } else {
                console.log(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };


    // 重新計算每個折線圖的高度
    const calculateChartHeight = () => {
        const trueCount = Object.values(chartVisibilityMap).filter(value => value === true).length - 1;
        const totalHeight = 275;
        const minHeight = 50;
        const padding = 0;
        const calculatedHeight = Math.floor((totalHeight - padding * (trueCount - 1)) / trueCount);
        return calculatedHeight < minHeight ? minHeight : calculatedHeight;
    };
  
    // 時間filter(Day, Hour)改變
    const updateChart = () => {
        const height = calculateChartHeight();
        setChartHeight(height);
    
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();
        let hours = newDate.getHours();
        let minutes = (newDate.getMinutes() === 0) ? '00' : newDate.getMinutes();
    
        if (chartVisibilityMap['daybtn']) {
            fetchData(boxId, `${year}-${month}-${day}`);
            fetchoutData(boxId, `${year}-${month}-${day}`);
        } else {
            if (hours>=chartVisibilityMap['selectedHour'])
            {
                fetchData(boxId, `${year}-${month}-${day} ${hours - chartVisibilityMap['selectedHour']}:${minutes}`);
                fetchoutData(boxId, `${year}-${month}-${day} ${hours - chartVisibilityMap['selectedHour']}:${minutes}`);
            }
            else {
                fetchData(boxId, `${year}-${month}-${day}`);
                fetchoutData(boxId, `${year}-${month}-${day}`);
            }
            
        }
    };

    // 隨時監聽socket - ngrowin_update事件
    useEffect(() => {
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth() + 1; // 注意月份從0開始，需要加1
        let currentDay = currentDate.getDate();
      
        fetchData(boxId, `${currentYear}-${currentMonth}-${currentDay}`);
        fetchoutData(boxId, `${currentYear}-${currentMonth}-${currentDay}`);

        socket.on("ngrowin_update", updateChart);
        socket.on("ngrowout_update", updateChart);
        return () => {
            socket.off("ngrowin_update");
            socket.off("ngrowout_update");
        }
    }, [boxId]);
  
    // 折線圖數據有更新，最大最小值重新計算
    useEffect(() => {
        const extremes = {};
        chartdata.forEach(entry => {
            Object.keys(entry).forEach(key => {
                if (key !== 'timestamp') {
                    if (!extremes[key]) {
                        extremes[key] = { min: entry[key], max: entry[key] };
                        } else {
                        extremes[key].min = Math.floor(Math.min(extremes[key].min, entry[key]));
                        extremes[key].max = Math.ceil(Math.max(extremes[key].max, entry[key]));
                    }
                }
            });
        });
        const outextremes = {};
        chartoutdata.forEach(entry => {
            Object.keys(entry).forEach(key => {
                if (key !== 'timestamp') {
                    if (!outextremes[key]) {
                        outextremes[key] = { min: entry[key], max: entry[key] };
                        } else {
                        outextremes[key].min = Math.floor(Math.min(outextremes[key].min, entry[key]));
                        outextremes[key].max = Math.ceil(Math.max(outextremes[key].max, entry[key]));
                    }
                }
            });
        });
        setParaExtremes(extremes);
        setParaoutExtremes(outextremes);
    }, [chartdata, chartoutdata]);
  
    useEffect(() => {
        updateChart();
    }, [chartVisibilityMap]);

    const CustomTooltip = ({ active, payload, label,  parameter}) => {
        if (active && payload && payload.length) {
            // console.log(payload[0]);
            const imgSrc = `/${parameter.toLowerCase()}.png`;
            return (
                <div className='tips'>
                    <img className='tip_img' src={imgSrc}></img>
                    <div className='tip_text'>
                        <div className='tis_value'>{parameter}</div>
                        <div className='tis_value'>{`${payload[0].value}`}</div>
                        {/* {`${label}`}:代表X軸的時間 */}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ borderRadius: '10px', width:'100%', height:'100%'}}>
            {chartVisibilityMap['outairtemp'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartoutdata}
                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraoutExtremes['airtemp']?.min || 'auto',
                                paraoutExtremes['airtemp']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#9A91F2' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['outairtemp'] && 
                    (<Line type="monotoneX" dataKey="airtemp" 
                            stroke="#9A91F2" strokeWidth={2}
                            name="Out-Airtemp" activeDot={{ r: 8 }}/>) }
                    <Tooltip />
                    <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/>
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['outhumidity'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartoutdata}
                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraoutExtremes['humidity']?.min || 'auto',
                                paraoutExtremes['humidity']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#f98d47' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['outhumidity'] && 
                    (<Line type="monotoneX" dataKey="humidity" 
                            stroke="#f98d47" strokeWidth={2}
                            name="Out-Humidity" activeDot={{ r: 8 }}/>) }
                    <Tooltip />
                    <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/>
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['inairtemp'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraExtremes['airtemp']?.min || 'auto',
                                paraExtremes['airtemp']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#BCAF19' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['inairtemp'] && 
                    (<Line type="monotoneX" dataKey="airtemp" 
                            stroke="#BCAF19" strokeWidth={2}
                            name="Airtemp" activeDot={{ r: 8 }}/>) }
                    <Tooltip content={<CustomTooltip parameter={'Airtemp'}></CustomTooltip>}/>
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['inhumidity'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraExtremes['inhumidity']?.min || 'auto',
                                paraExtremes['inhumidity']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#F8961E' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['inhumidity'] && 
                    (<Line type="monotoneX" dataKey="humidity" 
                            stroke="#F8961E" strokeWidth={2}
                            name="Humidity" activeDot={{ r: 8 }}/>) }
                    <Tooltip content={<CustomTooltip parameter={'humidity'}></CustomTooltip>}/>
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['luminance'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis dataKey="timestamp"
                            interval={5}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#fff' }}  // 設置刻度的樣式
                            axisLine={{ strokeWidth: 2 }} 
                            padding={{right:10}}/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraExtremes['luminance']?.min || 'auto',
                                paraExtremes['luminance']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 12, fontWeight: 'bold', fill: '#F94144' }}
                            axisLine={{ strokeWidth: 2 }}/>
                    {chartVisibilityMap['luminance'] && 
                    (<Line type="monotoneX" dataKey="luminance" 
                            stroke="#F94144" strokeWidth={2}
                            name="Luminance" activeDot={{ r: 8 }}/>) }
                    <Tooltip content={<CustomTooltip parameter={'luminance'}></CustomTooltip>}/>
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }
        </div>
    );
};

export default LineChartCom;
