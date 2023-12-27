// LineChartCom.jsx
import React, { useState } from 'react';
import { useEffect } from 'react';
// import { LineChart } from '@mui/x-charts/LineChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const LineChartCom = ({ curboxid }) => {

    const [chartdata, setchartdata] = useState([]);
    const fetchData = async (boxid) => {
        try {
            const startDate = ('2023-12-25');
            const attributes = 'timestamp,airtemp,humidity';

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
    }, []);

    return (

        // <LineChart
        //     width={500}
        //     height={300}
//     series={[
        //         { data: pData, label: 'pv' },
        //         { data: uData, label: 'uv' },
        //     ]}
        //     xAxis={[{ scaleType: 'point', data: xLabels }]}
        // />
        <>
        <ResponsiveContainer height="50%" width="100%">
            <LineChart
                syncId="mySyncId"
                data={chartdata}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="timestamp" 
                        interval={7}
                        tickFormatter={(value) => value.substr(11)}
                        hide="true"/>                
                <YAxis domain={[21, 'auto']} padding={{ bottom: 20 }} />
                <Tooltip />
                {/* <Legend /> */}
                <Line type="monotoneX" dataKey="airtemp" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>

            <LineChart
                data={chartdata}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                syncId="mySyncId"
            >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis
                dataKey="timestamp"
                interval={7}
                tickFormatter={(value) => value.substr(11)}
            />
            <YAxis domain={[21, 34]} />
            <Tooltip />
            <Legend />
            <Line type="monotoneX" dataKey="humidity" stroke="#82ca9d" name="Humidity" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
        {/* <ResponsiveContainer height={200} width="100%">
            <LineChart
            data={chartdata}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis
                dataKey="timestamp"
                interval={7}
                tickFormatter={(value) => value.substr(11)}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotoneX" dataKey="humidity" stroke="#82ca9d" name="Humidity" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer> */}
        </>
    );
};

export default LineChartCom;
