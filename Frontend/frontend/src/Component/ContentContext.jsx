// ContentContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';

import { useSocket } from './SocketContext';

const ContentContext = createContext();

export function useContent() {
    return useContext(ContentContext);
}
  
export function ContentProvider({ children, socket, boxId }) {
    const [data, setData] = useState([]); // 你的資料結構，根據實際需求調整
    // const isConnected = useSocket();

    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day;

    const fetchData = async (boxId) => {
        try {
            // const startDate = ('2023-12-29');
            const attributes = 'timestamp,luminance,airtemp,humidity';

            const growURL = `http://127.0.0.1:8000/boxgrowin/${boxId}/?start_date=${fulldate}`;

            const response = await fetch(growURL);
            // const response = await fetch(`http://127.0.0.1:8000/boxgrowin/${boxid}/?start_date=2023-11-05 & attributes=timestamp,airtemp`);
            if (response.ok) {
                const jsonData = await response.json();
                const processedData = jsonData;
                setData(processedData);
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

        socket.on("ngrowin_update", ngrowin_update);

        // if (isConnected) {
        //     socket.on('yourSocketEvent', handleSocketEvent);
        // }

        // 在這裡添加 fetch 資料庫的邏輯
        
        fetchData(boxId); // 在元件 mount 時即執行一次 fetch

        // 清理工作
        return () => {
            socket.off("ngrowin_update")
        };
    }, [boxId]);
  
    // const value = { data };
  
    return (
      <ContentContext.Provider value={data}>
        {children}
      </ContentContext.Provider>
    );
}