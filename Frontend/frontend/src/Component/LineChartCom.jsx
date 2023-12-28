// LineChartCom.jsx
import React, { useState } from 'react';
import { useEffect } from 'react';
// import { LineChart } from '@mui/x-charts/LineChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const LineChartCom = ({ socket }) => {

    const [chartdata, setchartdata] = useState([]);
    const [maxAirtemp, setMaxAirtemp] = useState('auto');
    const [minAirtemp, setMinAirtemp] = useState(0);
    const [maxHumidiy, setmaxHumidiy] = useState('auto');
    const [minHumidiy, setminHumidiy] = useState(0)
    const [maxBrightn, setmaxBrightn] = useState('auto');
    const [minBrightn, setminBrightn] = useState(0)

    const fetchData = async (boxid) => {
        try {
            const startDate = ('2023-12-28');
            const attributes = 'timestamp,luminance,airtemp,humidity';

            const encodedURL = `http://127.0.0.1:8000/boxgrowin/${boxid}/?start_date=${(startDate)}&attributes=${(attributes)}`;

            const response = await fetch(encodedURL);
            // const response = await fetch(`http://127.0.0.1:8000/boxgrowin/${boxid}/?start_date=2023-11-05 & attributes=timestamp,airtemp`);
            if (response.ok) {
                const jsonData = await response.json();
                setchartdata(jsonData.reverse());
                console.log(jsonData)
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
        <ResponsiveContainer height={130} >
            <LineChart
                data={chartdata}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                syncId="mySyncId"
            >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis
                    dataKey="timestamp"
                    // interval={7}
                    tickFormatter={(value) => value.substr(11)}
                    hide="true" />
                <YAxis domain={[6000, 8700]} />
                <Tooltip />
                <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }} />
                <Line type="monotoneX" dataKey="luminance" stroke="#82ca9d" name="Luminance" activeDot={{ r: 8 }} />
            </LineChart>

            <LineChart
                syncId="mySyncId"
                data={chartdata}
                margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="timestamp" 
                        // interval={7}
                        tickFormatter={(value) => value.substr(11)}
                        hide="true"/>                
                <YAxis domain={[minAirtemp?minAirtemp:0, maxAirtemp?maxAirtemp:'auto']} padding={{ bottom: 20 }} />
                
                <Tooltip />
                <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/>
                <Line type="monotoneX" dataKey="airtemp" stroke="#8884d8" name="Airtemp" activeDot={{ r: 8 }} />
                {/* <YAxis domain={[21, 34]} /> */}
                <Line type="monotoneX" dataKey="humidity" stroke="#82ca9d" name="Humidity" activeDot={{ r: 8 }}/>
            </LineChart>

            <LineChart
                data={chartdata}
                margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                syncId="mySyncId"
            >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis
                    dataKey="timestamp"
                    interval={0}
                    tickFormatter={(value) => value.substr(11)}/>
                <YAxis domain={[21, 34]} />
                <Tooltip />
                <Legend verticalAlign="middle" layout="vertical" align="right" 
                        wrapperStyle={{ width: '120px' }}/>
                {true && (<Line type="monotoneX" dataKey="humidity" stroke="#82ca9d" name="Humidity" activeDot={{ r: 8 }}/>) }
            </LineChart>
        </ResponsiveContainer>
        </>
    );
};

export default LineChartCom;
