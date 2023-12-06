import React, { Component } from "react";
import { render } from "react-dom";
import { useState, useEffect } from "react";
import "../CSS/Dashboard.css";

import BoxBtnList from "./BoxBtnList";
import BoxInfo from "./BoxInfo";
import GrowInfo from "./GrowInfo";
import { socket } from "../socket";
import LedControl from "./LedControl";
import LineChartCom from './LineChartCom'

const dashboard2 = {
    name: "Dashboard",
    theme: {
        backgroundColor: "black",
        color: "White",
    },
};

// // 建立 BoxInfo component
// // 使用專屬的 BoxInfo component 顯示 Box 資訊。
// const BoxInfo = ({ data }) => (
//   <div>
//     <h1>Box Info</h1>
//     <p>Box id: {data.id}</p>
//     <p>Box name: {data.name}</p>
//     <p>Users: {data.users}</p>
//     <p>Plant: {data.plant}</p>
//   </div>
// );

// 建立 GrowInfo component
// 使用專屬的 GrowInfo component 顯示 GrowthRecords 資訊。
// const GrowInfo = ({ data }) => (
//   <div>
//     <h2>GrowthRecords</h2>
//     <table>
//       <thead>
//         <tr>
//           <th>Timestamp</th>
//           <th>Airtemp</th>
//           <th>Humidity</th>
//           <th>Luminance</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((record, index) => (
//           <tr key={index}>
//             <td>{(record.timestamp).replace("T", " ")}</td>
//             <td>{record.airtemp}</td>
//             <td>{record.humidity}</td>
//             <td>{record.luminance}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

export function D2() {
    // 在 D2 元件中設定 state 來管理接收到的訊息
    const [message, setMessage] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connect());
    const [test, settest] = useState("");
    //socket.connected => 描述當前socket連接狀態，true：已連接；false：尚未連接

    useEffect(() => {
        // 建立 Socket.IO 連線
        // ws stores socket connection status
        // When ws is empty (no connection), a connection is made.
        // if (!ws){
        //     console.log("ws is null.");
        //     setws(socket.connect())
        //     console.log(ws);
        // }
        // if(ws)
        // {
        //     // console.log(ws.id);
        //     ws.on('getMessage', (data) => {
        //       console.log("getMessage:" + data);
        //       setMessage(data);
        //   });
        // }

        // socket.on('connect', onConnect);
        function getMessage(value) {
            settest("From Socket Server: " + value);
            console.log(socket.id);
            console.log(value);
            //------------------------
            //http://127.0.0.1:8000/boxinfo/1
            fetch("http://127.0.0.1:8000/boxgrowin/1/").then((response) => {
                response.json().then((text) => {
                    console.log(test + ": " + text.users); // 拿到 response.body 轉成的物件
                    setMessage(text);
                });
            });
        }

        function ngrowin_update() {
            console.log("N-growin update");
            fetch(
                "http://127.0.0.1:8000/boxgrowin/1/?start_date=2023-12-04"
            ).then((response) => {
                response.json().then((text) => {
                    console.log(text); // 拿到 response.body 轉成的物件
                    setMessage(text);
                });
            });
        }

        function ngrowout_update() {
            console.log("Ngrowout_update");
        }
        function data_change() {
            console.log("Empty Event");
        }

        socket.on("getMessage", getMessage);
        socket.on("ngrowin_update", ngrowin_update);
        socket.on("ngrowout_update", ngrowout_update);
        socket.on("data_change", data_change);
        // 在元件卸載時斷開 Socket.IO 連線
        return () => {
            // socket.disconnect()
        };
    }, []);

    // 在 D2 元件中可以顯示接收到的訊息
    return (
        <div>
            <p>{test}</p>
            <LedControl socket={isConnected}></LedControl>
        </div>
    );
}

export function Dashboard() {
    // 使用 useState Hook 定義了一個 data 狀態變數和一個 setData 函數。
    // 當收到伺服器回應後，使用 setData 函數更新狀態，以便在元件中顯示資料。
    const [boxdata, setData] = useState(null);
    const [growdata, setGData] = useState(null);
    const [error, setError] = useState(null);
    const [cur_box, setCurBox] = useState(null);

    const fetchData = async (boxId) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/boxinfo/${boxId}`
            );

            if (response.ok) {
                const jsonData = await response.json();
                console.log(jsonData.users);
                setData(jsonData);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
        // -----------------growth info-------------------
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/boxgrowin/${boxId}/?start_date=2023-11-30 16:40:00`
            );

            if (response.ok) {
                const jsonData = await response.json();
                setGData(jsonData);
                console.log(jsonData);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const handleButtonClick = (boxId) => {
        // Call fetchData with the selected boxId
        setCurBox(boxId);
        fetchData(boxId);
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title" style={dashboard2.theme}>
                {dashboard2.name}
            </h2>
            <div className="dashboard-content">
                <div className="box-info">
                    {boxdata && <BoxInfo data={boxdata} />}
                    <BoxBtnList onButtonClick={handleButtonClick} />
                    {growdata ? (
                        <div className="grow-info-container">
                            <GrowInfo data={growdata} />
                        </div>
                    ) : null}
                </div>

                {/* <div className="middlePic-container">
                    <div className="upper-section"> */}
                        {/* 上半部分放置圖片 */}
                        {/* {cur_box&&<LineChartCom data={cur_box}></LineChartCom>} */}
                        {/* <img src="your-upper-image-url.jpg" alt="Upper Section" /> */}
                    {/* </div>
                    <div className="lower-section">
                        {/* 下半部分放置圖片 */}
                        {/* <img src="your-lower-image-url.jpg" alt="Lower Section" />
                    </div>
                </div> */}

                <div className="device-info">
                    <D2></D2>
                    {/* <LedControl socket={isConnected}></LedControl> */}
                </div>
            </div>
        </div>
        // <div>
        //     <D2></D2>
        //     {/* <LedControl></LedControl> */}
        //     <BoxBtnList onButtonClick={handleButtonClick} />
        //     {boxdata && <BoxInfo data={boxdata} />}
        //     {/* {boxdata && <EditBtn btnInfo={boxdata} />} */}
        //     {growdata ? <GrowInfo data={growdata}/> : null}
        //     {/* {error && <div>Error: {error}</div>} */}
        //     {error ? <div>Error: {error}</div> : null}
        // </div>
    );
}
