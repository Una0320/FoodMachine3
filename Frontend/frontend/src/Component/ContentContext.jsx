// ContentContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCtrline } from './ChartCtlContext';
import { useSocket } from './SocketContext';

const ContentContext = createContext();

export function useContent() {
    return useContext(ContentContext);
}
  
export function ContentProvider({ children, socket, boxId })
{
    const { chartVisibilityMap } = useCtrline();
    const [data, setdata] = useState([]); // 你的資料結構，根據實際需求調整
    const [outdata, setoutdata] = useState([]); // 你的資料結構，根據實際需求調整
    const [chartoutdata, setChartoutdata] = useState([]);
    // const isConnected = useSocket();

    let newDate = new Date();
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let hours = newDate.getHours();
    let minutes = (newDate.getMinutes() === 0) ? '00' : newDate.getMinutes();
    let fulldate = year + "-" + month + "-" + day;

    // 時間格式
    const formatDate = (timestamp) => {
        const time = new Date(timestamp);
        const hour = time.getHours();
        const min = (time.getMinutes() === 0) ? '00' : time.getMinutes();
        return `${hour}:${min}`;
    };

    const fetchData = async (boxId) => {
        try {
            // const startDate = ('2023-12-29');
            const attributes = 'timestamp,luminance,airtemp,humidity';

            const growURL = `http://127.0.0.1:8000/boxgrowin/${boxId}/?start_date=${fulldate}`;

            const response = await fetch(growURL);
            // const response = await fetch(`http://127.0.0.1:8000/boxgrowin/${boxid}/?start_date=2023-11-05 & attributes=timestamp,airtemp`);
            if (response.ok) {
                const jsonData = await response.json();
                const processedData = jsonData.map(entry => ({ ...entry, timestamp: formatDate(entry.timestamp) })).reverse();
                setdata(processedData);
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
                setoutdata(processedData);
                console.log(processedData);
            } else {
                console.log(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        // 在這裡添加監聽 socket 事件的邏輯
        function ngrowin_update() {
            console.log("ContentContext");
            fetchData(boxId);
        }

        function ngrowout_update()
        {
            fetchoutData(boxId);
            console.log("ContentContext_out");
        }

        socket.on("ngrowin_update", ngrowin_update);
        socket.on("ngrowout_update", ngrowout_update);
        
        fetchData(boxId); // 在元件 mount 時即執行一次 fetch
        fetchoutData(boxId);

        // 清理工作
        return () => {
            socket.off("ngrowin_update");
            socket.off("ngrowout_update");
        };
    }, [boxId]);
  
    // const value = { data };
  
    return (
        <ContentContext.Provider value={data}>
            {children}
        </ContentContext.Provider>
    );
}