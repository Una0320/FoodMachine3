// LineChartCom.jsx
import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../CSS/LineChartCom.css'
import { useCtrline } from './ChartCtlContext';
import { useContent } from './ContentContext';

const LineChartCom = ({ socket , boxId}) => {

    //Today's date
    // const { chartVisibilityMap } = useCtrline();
    const {chartVisibilityMap, toggleChartVisibility, updateSelectedHour} = useCtrline()
    // const { data, outdata } = useContent();

    const [lasttime, setlasttime] = useState(' ');
    const [chartHeight, setChartHeight] = useState(30);
    const [chartdata, setChartdata] = useState([]);
    const [chartoutdata, setChartoutdata] = useState([]);
    const [paraExtremes, setParaExtremes] = useState({});
    const [paraoutExtremes, setParaoutExtremes] = useState({});

    // 創建一個 ref 來存放 content_down 元素
    const contentDownRef = useRef(null);

    
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
            const encodedURL = `http://192.168.1.213:8000/boxgrowin/${boxid}/?start_date=${date}&attributes=${attributes}`;
    
            const response = await fetch(encodedURL);
            if (response.ok) {
                const jsonData = await response.json();
                if(jsonData.length > 0){
                    setlasttime(jsonData[0].timestamp.replace("T", " "));
                }
                else{
                    setlasttime(' ')
                }
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
            const encodedURL = `http://192.168.1.213:8000/boxgrowout/?box_id=${boxid}&start_date=${date}&attributes=${attributes}`;
    
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
    const calculateChartHeight = (totalHeight) => {
        let trueCount = Object.values(chartVisibilityMap).filter(value => value === true).length - 1;
        // const totalHeight = contentDownRef.current.clientHeight;
        // const totalHeight = 312
        const minHeight = 33;
        const padding = 0;
        const calculatedHeight = Math.floor((totalHeight - padding * (trueCount - 1)) / trueCount);
        return calculatedHeight < minHeight ? minHeight : calculatedHeight;
    };
  
    // 時間filter(Day, Hour)改變
    const updateOutChart = () => {
        let cheight = calculateChartHeight(340);
        console.log(cheight);
        setChartHeight(cheight);
    
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();
        let hours = newDate.getHours();
        let minutes = (newDate.getMinutes() === 0) ? '00' : newDate.getMinutes();
    
        if (chartVisibilityMap['daybtn']) {
            fetchoutData(boxId, `${year}-${month}-${day}`);
        }
        else if(chartVisibilityMap['weekbtn']){
            fetchoutData(boxId, `${year}-${month}-${day-7}`);
        } 
        else {
            if (hours>=chartVisibilityMap['selectedHour'])
            {

                fetchoutData(boxId, `${year}-${month}-${day} ${hours - chartVisibilityMap['selectedHour']}:${minutes}`);
            }
            else {

                fetchoutData(boxId, `${year}-${month}-${day}`);
            }
            
        }
    };

    const updateChart = () => {
        let cheight = calculateChartHeight(340);
        console.log(cheight);
        setChartHeight(cheight);
    
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();
        let hours = newDate.getHours();
        let minutes = (newDate.getMinutes() === 0) ? '00' : newDate.getMinutes();
    
        if (chartVisibilityMap['daybtn']) {
            fetchData(boxId, `${year}-${month}-${day}`);
        }
        else if(chartVisibilityMap['weekbtn']){
            fetchData(boxId, `${year}-${month}-${day-7}`);
        } 
        else {
            if (hours>=chartVisibilityMap['selectedHour'])
            {
                fetchData(boxId, `${year}-${month}-${day} ${hours - chartVisibilityMap['selectedHour']}:${minutes}`);

            }
            else {
                fetchData(boxId, `${year}-${month}-${day}`);

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
        socket.on("ngrowout_update", updateOutChart);
        return () => {
            socket.off("ngrowin_update");
            socket.off("ngrowout_update");
        }
    }, [boxId]);
  
    // 折線圖數據有更新，最大最小值重新計算
    useEffect(() => {
        let cheight = calculateChartHeight(340);
        setChartHeight(cheight);
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
        updateOutChart();
        let cheight = calculateChartHeight(340);
        console.log(cheight);
        setChartHeight(cheight);
    }, [boxId, chartVisibilityMap]);

    // useEffect(()=>{
    //     const redata = data;
    //     setChartdata(redata.reverse());
    //     console.log(data);
    //     console.log(chartdata[0]);
    // },[data])
    // useEffect(()=>{
    //     const reoutdata = outdata;
    //     setChartoutdata(reoutdata.reverse());
    // },[outdata])


    const CustomTooltip = ({ active, payload, label,  parameter, dynamicColor}) => {
        let trueCount = Object.values(chartVisibilityMap).filter(value => value === true).length - 1;
        // console.log(trueCount);
        if (active && payload && payload.length) {
            // console.log(payload[0]);
            const imgSrc = `/${parameter.toLowerCase()}.png`;
            if (trueCount<=7){
                return (
                    <div className='tips'>
                        <img className='tip_img' src={imgSrc}></img>
                        <div className='tip_text'>
                            <div className='tis_value' style={{ color: dynamicColor }}>{parameter}</div>
                            <div className='tis_value' style={{ color: dynamicColor }}>{`${parseFloat(payload[0].value).toFixed(2)}`}</div>
                            {/* {`${label}`}:代表X軸的時間 */}
                        </div>
                    </div>
                )
            }
            else{
                return (
                    <div className='tips8'>
                        <img className='tip_img8' src={imgSrc}></img>
                        <div className='tip_text8'>
                            <div className='tis_value8' style={{ color: dynamicColor }}>
                                {parameter}{"    "}{`${parseFloat(payload[0].value).toFixed(3)}`}
                            </div>
                            {/* <div className='tis_value' style={{ color: dynamicColor }}>{`${payload[0].value}`}</div> */}
                            {/* {`${label}`}:代表X軸的時間 */}
                        </div>
                    </div>                    
                )
            }
            
        }
        return null;
    };

    return (
        <>
        <div className="timefilter">
            <span>SENSOR VALUE</span>
            <button className={`timebtn ${chartVisibilityMap['hourbtn'] ? 'active' : ''}`}
                    onClick={() => toggleChartVisibility('hourbtn')}>Hour</button>
            <button className={`timebtn ${chartVisibilityMap['daybtn'] ? 'active' : ''}`}
                    onClick={() => toggleChartVisibility('daybtn')}>Day</button>
            <button className={`timebtn ${chartVisibilityMap['weekbtn'] ? 'active' : ''}`}
                    onClick={() => toggleChartVisibility('weekbtn')}>Week</button>
            <button className="timebtn">Month</button>
            <span style={{marginLeft:'30px'}}>Latest update time : {lasttime}</span>
        </div>
        <div style={{height:'100%'}} ref={contentDownRef}>
            {chartVisibilityMap['inairtemp'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    {/* <CartesianGrid strokeDasharray="1 1" /> */}
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
                            name="Airtemp" 
                            dot={null} activeDot={{ fill: '#BCAF19', r: 6 }}/>) }
                    <Tooltip content={<CustomTooltip parameter={'inAirtemp'} dynamicColor={'#BCAF19'}></CustomTooltip>}/>
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
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 0 }} 
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
                            name="Humidity" 
                            dot={null} activeDot={{ fill: '#F8961E', r: 6 }}/>
                    ) }
                    <Tooltip content={<CustomTooltip parameter={'inhumidity'} dynamicColor={'#F8961E'}></CustomTooltip>}/>
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
                    {/* <CartesianGrid strokeDasharray="1 1" /> */}
                    <XAxis dataKey="timestamp"
                            interval={5}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#fff' }}  // 設置刻度的樣式
                            hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraExtremes['luminance']?.min || 'auto',
                                paraExtremes['luminance']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#F94144' }}
                            axisLine={{ strokeWidth: 2 }}/>
                    {chartVisibilityMap['luminance'] && 
                    (<Line type="monotoneX" dataKey="luminance" 
                            stroke="#F94144" strokeWidth={2}
                            name="Luminance"
                            dot={null} activeDot={{ fill: '#F94144', r: 6 }}/>
                            ) }
                    <Tooltip content={<CustomTooltip parameter={'luminance'} dynamicColor={'#F94144'}></CustomTooltip>}/>
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['watertemp'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartoutdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    {/* <CartesianGrid strokeDasharray="1 1" /> */}
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraoutExtremes['watertemp']?.min || 'auto',
                                paraoutExtremes['watertemp']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#90BE6D' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['watertemp'] && 
                    (<Line type="monotoneX" dataKey="watertemp" 
                            stroke="#90BE6D" strokeWidth={2}
                            name="Water Temp" 
                            dot={null} activeDot={{ fill: '#90BE6D', r: 6 }}/>
                            ) }
                    <Tooltip content={<CustomTooltip parameter={'watertemp'} dynamicColor={'#90BE6D'}></CustomTooltip>}/>
                    
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['outhumidity'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartoutdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    {/* <CartesianGrid strokeDasharray="1 1" /> */}
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraoutExtremes['humidity']?.min || 'auto',
                                paraoutExtremes['humidity']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#87CEEB' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['outhumidity'] && 
                    (<Line type="monotoneX" dataKey="humidity" 
                            stroke="#87CEEB" strokeWidth={2}
                            name="Out-Humidity"
                            dot={null} activeDot={{ fill: '#87CEEB', r: 6 }}/>
                            ) }
                    <Tooltip content={<CustomTooltip parameter={'outhumidity'} dynamicColor={'#87CEEB'}></CustomTooltip>}/>
                    
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['outairtemp'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartoutdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    {/* <CartesianGrid strokeDasharray="1 1" /> */}
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraoutExtremes['airtemp']?.min || 'auto',
                                paraoutExtremes['airtemp']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#7B68EE' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['outairtemp'] && 
                    (<Line type="monotoneX" dataKey="airtemp" 
                            stroke="#7B68EE" strokeWidth={2}
                            name="Out-Airtemp"
                            dot={null} activeDot={{ fill: '#7B68EE', r: 6 }}/>
                            ) }
                    <Tooltip content={<CustomTooltip parameter={'outairtemp'} dynamicColor={'#7B68EE'}></CustomTooltip>}/>
                    
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['ph'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartoutdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    {/* <CartesianGrid strokeDasharray="1 1" /> */}
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraoutExtremes['ph']?.min || 'auto',
                                paraoutExtremes['ph']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#488BDA' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['ph'] && 
                    (<Line type="monotoneX" dataKey="ph" 
                            stroke="#488BDA" strokeWidth={2}
                            name="pH"
                            dot={null} activeDot={{ fill: '#488BDA', r: 6 }}/>
                            ) }
                    <Tooltip content={<CustomTooltip parameter={'ph'} dynamicColor={'#488BDA'}></CustomTooltip>}/>
                    
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['ec'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartoutdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    {/* <CartesianGrid strokeDasharray="1 1" /> */}
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraoutExtremes['ec']?.min || 'auto',
                                paraoutExtremes['ec']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#F9C74F' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['ec'] && 
                    (<Line type="monotoneX" dataKey="ec" 
                            stroke="#F9C74F" strokeWidth={2}
                            name="ec" 
                            dot={null} activeDot={{ fill: '#F9C74F', r: 6 }}/>
                            ) }
                    <Tooltip content={<CustomTooltip parameter={'ec'} dynamicColor={'#F9C74F'}></CustomTooltip>}/>
                    
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }
            
            {chartVisibilityMap['co2'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartoutdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    {/* <CartesianGrid strokeDasharray="1 1" /> */}
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraoutExtremes['co2']?.min || 'auto',
                                paraoutExtremes['co2']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#FFA07A' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['co2'] && 
                    (<Line type="monotoneX" dataKey="co2" 
                            stroke="#FFA07A" strokeWidth={2}
                            name="co2"
                            dot={null} activeDot={{ fill: '#FFA07A', r: 6 }}/>
                            ) }
                    <Tooltip content={<CustomTooltip parameter={'co2'} dynamicColor={'#FFA07A'}></CustomTooltip>}/>
                    
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['oxygen'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartoutdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    {/* <CartesianGrid strokeDasharray="1 1" /> */}
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraoutExtremes['oxygen']?.min || 'auto',
                                paraoutExtremes['oxygen']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#7BB249' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['oxygen'] && 
                    (<Line type="monotoneX" dataKey="oxygen" 
                            stroke="#7BB249" strokeWidth={2}
                            name="oxygen"
                            dot={null} activeDot={{ fill: '#7BB249', r: 6 }}/>
                            ) }
                    <Tooltip content={<CustomTooltip parameter={'oxygen'} dynamicColor={'#7BB249'}></CustomTooltip>}/>
                    
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }

            {chartVisibilityMap['waterlevel'] &&
                <ResponsiveContainer height={chartHeight}>
                <LineChart
                    syncId="mySyncId"
                    data={chartoutdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    {/* <CartesianGrid strokeDasharray="1 1" /> */}
                    <XAxis
                        dataKey="timestamp"
                        interval={5}
                        hide/>
                    <YAxis padding={{ bottom: 20 }} 
                            domain={[
                                paraoutExtremes['waterlevel']?.min || 'auto',
                                paraoutExtremes['waterlevel']?.max || 'auto'
                            ]}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#20B2AA' }}
                            axisLine={{ strokeWidth: 2 }}
                    />
                    {chartVisibilityMap['waterlevel'] && 
                    (<Line type="monotoneX" dataKey="waterlevel" 
                            stroke="#20B2AA" strokeWidth={2}
                            name="waterlevel" 
                            dot={null} activeDot={{ fill: '#20B2AA', r: 6 }}/>
                            ) }
                    <Tooltip content={<CustomTooltip parameter={'waterlevel'} dynamicColor={'#20B2AA'}></CustomTooltip>}/>
                    
                    {/* <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/> */}
                </LineChart>
                </ResponsiveContainer>
            }
            <ResponsiveContainer height={25}>
                <LineChart
                    syncId="mySyncId"
                    data={chartdata?chartdata:chartoutdata}
                    margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis dataKey="timestamp"
                            interval={5}
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#fff' }}  // 設置刻度的樣式
                            axisLine={{ strokeWidth: 2 }} 
                            padding={{right:10}}/>
                    <YAxis display="none" />
                </LineChart>
            </ResponsiveContainer>
        </div>
        </>
    );
};

export default LineChartCom;
