// LastGrowIN.jsx
import React, { useState, useEffect } from 'react';
import '../CSS/Dashboard.css'

const LastGrowIN = ({ socket, boxId }) => {

    //Today's date
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day;
    const [data, setdata] = useState([]);

    const fetchgrowdata = async (boxId) => {
        // -----------------growth info-------------------
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/boxgrowin/${boxId}/?start_date=${fulldate}`
            );

            if (response.ok) {
                const jsonData = await response.json();
                setdata(jsonData[0]);
                // console.log(jsonData[0]);
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
            fetchgrowdata(boxId);
        }
        socket.off("ngrowin_update")
        socket.on("ngrowin_update", ngrowin_update);
    }, [boxId]);

    return(
        <div className="grow-info">
            {data ? (
                <h2>
                    {data.timestamp && data.timestamp.replace("T", " ")}<br/>
                    {data.luminance}<br/>
                    {data.airtemp}<br/>
                    {data.humidity}<br/>
                    {data.sunlong}<br/>
                </h2>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default LastGrowIN;
