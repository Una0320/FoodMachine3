// LineChartCom.jsx
import React, { useState } from 'react';
import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useCtrline } from './ChartCtlContext';

const LineChartCom = ({ socket , boxId}) => {

    //Today's date
    const { chartVisibilityMap } = useCtrline();
    const [chartHeight, setChartHeight] = useState(464);
    const [chartdata, setChartdata] = useState([]);
    const [parameterExtremes, setParameterExtremes] = useState({});

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

    // 重新計算每個折線圖的高度
    const calculateChartHeight = () => {
        const trueCount = Object.values(chartVisibilityMap).filter(value => value === true).length - 1;
        const totalHeight = 449;
        const minHeight = 50;
        const padding = 15;
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
        } else {
            fetchData(boxId, `${year}-${month}-${day} ${hours - 2}:${minutes}`);
        }
    };

    // 隨時監聽socket - ngrowin_update事件
    useEffect(() => {
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth() + 1; // 注意月份從0開始，需要加1
        let currentDay = currentDate.getDate();
      
        fetchData(boxId, `${currentYear}-${currentMonth}-${currentDay}`);
        socket.on("ngrowin_update", updateChart);
        return () => socket.off("ngrowin_update");
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
        setParameterExtremes(extremes);
    }, [chartdata]);
  
    useEffect(() => {
        updateChart();
    }, [chartVisibilityMap]);

    return (
        <div style={{ backgroundColor: '#E0E0E0', borderRadius: '10px', width:'100%', height:'100%'}}>
            {chartVisibilityMap['inairtemp'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartdata}
                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                parameterExtremes['airtemp']?.min || 'auto',
                                parameterExtremes['airtemp']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#8884d8' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['inairtemp'] && 
                    (<Line type="monotoneX" dataKey="airtemp" 
                            stroke="#8884d8" strokeWidth={2}
                            name="Airtemp" activeDot={{ r: 8 }}/>) }
                    <Tooltip />
                    <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/>
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['inhumidity'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartdata}
                    margin={{ top: 15, right: 0, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                parameterExtremes['inhumidity']?.min || 'auto',
                                parameterExtremes['inhumidity']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#82ca9d' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['inhumidity'] && 
                    (<Line type="monotoneX" dataKey="humidity" 
                            stroke="#82ca9d" strokeWidth={2}
                            name="Humidity" activeDot={{ r: 8 }}/>) }
                    <Tooltip />
                    <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/>
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['luminance'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartdata}
                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis dataKey="timestamp"
                            interval={5}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#34495E' }}  // 設置刻度的樣式
                            axisLine={{ strokeWidth: 2 }} />
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                parameterExtremes['luminance']?.min || 'auto',
                                parameterExtremes['luminance']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 12, fontWeight: 'bold', fill: '#34495E' }}
                            axisLine={{ strokeWidth: 2 }}/>
                    {chartVisibilityMap['luminance'] && 
                    (<Line type="monotoneX" dataKey="luminance" 
                            stroke="#34495E" strokeWidth={2}
                            name="Luminance" activeDot={{ r: 8 }}/>) }
                    <Tooltip />
                    <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/>
                </LineChart>
                </ResponsiveContainer>
            }
        </div>
    );
};

export default LineChartCom;
