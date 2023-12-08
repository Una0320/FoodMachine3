// GrowInfo.jsx
import React, { useState, useEffect } from 'react';
import '../CSS/Dashboard.css'
const GrowInfo = ({ socket, boxId }) => {

    const [data, setdata] = useState([]);
    const fetchgrowdata = async (boxId) => {
        // -----------------growth info-------------------
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/boxgrowin/${boxId}/?start_date=2023-12-08`
            );

            if (response.ok) {
                const jsonData = await response.json();
                setdata(jsonData);
                // console.log(jsonData);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() =>{
        fetchgrowdata(boxId);
        function ngrowin_update() {
            console.log("N-growin update");
            // fetch(
            //     "http://127.0.0.1:8000/boxgrowin/1/?start_date=2023-12-08"
            // ).then((response) => {
            //     response.json().then((text) => {
            //         console.log(text); // 拿到 response.body 轉成的物件
            //         setdata(text);
            //     });
            // });
            fetchgrowdata(boxId);
        }

        socket.on("ngrowin_update", ngrowin_update);
    }, [boxId]);

    return(
        <div className="grow-info">
            <h2>GrowthRecords</h2>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Timestamp</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Airtemp</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Humidity</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Luminance</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((record, index) => (
                        <tr key={index}>
                            <td style={{ padding: '8px', textAlign: 'center' }}>{record.timestamp.replace("T", " ")}</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>{record.airtemp}</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>{record.humidity}</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>{record.luminance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GrowInfo;
