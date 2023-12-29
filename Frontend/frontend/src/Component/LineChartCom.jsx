// LineChartCom.jsx
import React, { useState } from 'react';
import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useCtrline } from './ChartCtlContext';

const LineChartCom = ({ socket }) => {

    //Today's date
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day //+ " 00:20";

    const [chartdata, setchartdata] = useState([]);
    const [maxAirtemp, setMaxAirtemp] = useState('auto');
    const [minAirtemp, setMinAirtemp] = useState(0);
    const [maxHumidiy, setmaxHumidiy] = useState('auto');
    const [minHumidiy, setminHumidiy] = useState(0)
    const [maxBrightn, setmaxBrightn] = useState('auto');
    const [minBrightn, setminBrightn] = useState(0)

    const {chartVisibilityMap, toggleChartVisibility} = useCtrline()

    const processTime = (data) => {
        return data.map(entry => {
            const time = new Date(entry.timestamp);
            const hour = time.getHours();
            const min = (time.getMinutes()) == '0'? '00':time.getMinutes();
            const formattedTime = `${hour}:${min}`;
            
            return {
                ...entry,
                timestamp: formattedTime
            };
        });
    };

    const fetchData = async (boxid) => {
        try {
            // const startDate = ('2023-12-29');
            const attributes = 'timestamp,luminance,airtemp,humidity';

            const encodedURL = `http://127.0.0.1:8000/boxgrowin/${boxid}/?start_date=${fulldate}&attributes=${(attributes)}`;

            const response = await fetch(encodedURL);
            // const response = await fetch(`http://127.0.0.1:8000/boxgrowin/${boxid}/?start_date=2023-11-05 & attributes=timestamp,airtemp`);
            if (response.ok) {
                const jsonData = await response.json();
                const processedData = processTime(jsonData.reverse());
                setchartdata(processedData);
                console.log(processedData);
            } else {
                console.log(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

    };

    useEffect(() => {
        fetchData(1);

        function ngrowin_update() {
            console.log("N-growin_LineChart");
            fetchData(1);
        }

        // socket.off("ngrowin_update")
        socket.on("ngrowin_update", ngrowin_update);

        return () => {
            // 在组件卸载时取消事件监听
            socket.off("ngrowin_update")
        };
    }, []);

    /* 當 chartdata 更新時，airtempValues 也會被重新計算，確保了正確的最大和最小值。 */
    useEffect(() => {
        const airtempValues = chartdata.map(entry => entry.airtemp);
        setMaxAirtemp(Math.max(...airtempValues));
        setMinAirtemp(Math.min(...airtempValues));
        console.log(maxAirtemp);
    }, [chartdata]);

    return (
        <>
        <ResponsiveContainer height={430} >
            <LineChart
                syncId="mySyncId"
                data={chartdata}
                margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis
                    dataKey="timestamp"
                    interval={5}/>       
                {/* <YAxis domain={[minAirtemp?minAirtemp:0, maxAirtemp?maxAirtemp:'auto']} padding={{ bottom: 20 }} /> */}
                <YAxis padding={{ bottom: 20 }} />
                <Tooltip />
                <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/>
                        
                {chartVisibilityMap['inairtemp'] && (<Line type="monotoneX" dataKey="airtemp" stroke="#8884d8" name="Airtemp" dot={null}/>) }
                {chartVisibilityMap['inhumidity'] && (<Line type="monotoneX" dataKey="humidity" stroke="#82ca9d" name="Humidity" activeDot={{ r: 8 }}/>) }
                {chartVisibilityMap['luminance'] && (<Line type="monotoneX" dataKey="luminance" stroke="#34495E" name="luminance" activeDot={{ r: 8 }}/>) }
            </LineChart>

            {/* <LineChart
                data={chartdata}
                margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                syncId="mySyncId"
            >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis
                    dataKey="timestamp"
                    interval={5}/>
                <YAxis domain={[21, 34]} />
                <Tooltip />
                <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/>
                {chartVisibilityMap['humidity'] && (<Line type="monotoneX" dataKey="humidity" stroke="#82ca9d" name="Humidity" activeDot={{ r: 8 }}/>) }
            </LineChart> */}
        </ResponsiveContainer>
        </>
    );
};

export default LineChartCom;
