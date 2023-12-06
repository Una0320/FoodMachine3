// LineChartCom.jsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const LineChartCom = ({ curboxid }) => {

    const [chartdata, setchartdata] = useState([]);
    const fetchData = async (boxid) => {
        try {
            const startDate = encodeURIComponent('2023-11-05');
            const attributes = 'timestamp,airtemp';

            const encodedURL = `http://127.0.0.1:8000/boxgrowin/${boxid}/?start_date=${encodeURIComponent(startDate)}&attributes=${encodeURIComponent(attributes)}`;

            const response = await fetch(encodedURL);
            // const response = await fetch(`http://127.0.0.1:8000/boxgrowin/${boxid}/?start_date=2023-11-05 & attributes=timestamp,airtemp`);
            if (response.ok) {
                const jsonData = await response.json();
                tempdata = jsonData
                setchartdata(jsonData);
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
        <LineChart width={400} height={300} data={chartdata}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
        </LineChart>
    );
};

export default LineChartCom;
