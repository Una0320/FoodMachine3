import React, { Component } from "react";
import { render } from "react-dom";
import { useState, useEffect } from "react";
import "../CSS/Dashboard.css";
import { Link } from 'react-router-dom';

import BoxBtnList from "./BoxBtnList";
import BoxInfo from "./BoxInfo";
import GrowInfo from "./GrowInfo";
import { socket } from "../socket";
import LedControl from "./LedControl";
import VideoStream from "./VideoStream";
import LineChartCom from './LineChartCom'

const dashboard2 = {
    name: "Dashboard",
    theme: {
        backgroundColor: "black",
        color: "White",
    },
};

export function D2({ ngrowindata }) {
    // 在 D2 元件中設定 state 來管理接收到的訊息
    // const [message, setMessage] = useState([]);
    // const [isConnected, setIsConnected] = useState(socket.connect());
    // const [test, settest] = useState("");
    // //socket.connected => 描述當前socket連接狀態，true：已連接；false：尚未連接

    // useEffect(() => {
    //     // 建立 Socket.IO 連線
    //     // ws stores socket connection status
    //     // When ws is empty (no connection), a connection is made.
    //     // if (!ws){
    //     //     console.log("ws is null.");
    //     //     setws(socket.connect())
    //     //     console.log(ws);
    //     // }
    //     // if(ws)
    //     // {
    //     //     // console.log(ws.id);
    //     //     ws.on('getMessage', (data) => {
    //     //       console.log("getMessage:" + data);
    //     //       setMessage(data);
    //     //   });
    //     // }

    //     // socket.on('connect', onConnect);
    //     function getMessage(value) {
    //         settest("From Socket Server: " + value);
    //         console.log(socket.id);
    //         console.log(value);
    //         //------------------------
    //         //http://127.0.0.1:8000/boxinfo/1
    //         fetch("http://127.0.0.1:8000/boxgrowin/1/").then((response) => {
    //             response.json().then((text) => {
    //                 console.log(test + ": " + text.users); // 拿到 response.body 轉成的物件
    //                 setMessage(text);
    //             });
    //         });
    //     }

    //     function ngrowin_update() {
    //         console.log("N-growin update");
    //         fetch(
    //             "http://127.0.0.1:8000/boxgrowin/1/?start_date=2023-12-08"
    //         ).then((response) => {
    //             response.json().then((text) => {
    //                 console.log(text); // 拿到 response.body 轉成的物件
    //                 setMessage(text);
    //                 ngrowindata(text);
    //             });
    //         });
    //     }

    //     function ngrowout_update() {
    //         console.log("Ngrowout_update");
    //         fetch(
    //           "http://127.0.0.1:8000/boxgrowout/?box_id=1&start_date=2023-12-07")
    //           .then((response) => {
    //             response.json().then((text) => {
    //               console.log(text);
    //           });
    //         });
    //     }
    //     function box_log(value) {
    //         console.log(value);
    //     }

    //     socket.on("getMessage", getMessage);
    //     socket.on("ngrowin_update", ngrowin_update);
    //     socket.on("ngrowout_update", ngrowout_update);
    //     socket.on("box_log", box_log);
    //     // 在元件卸載時斷開 Socket.IO 連線
    //     return () => {
    //         // socket.disconnect()
    //     };
    // }, []);

    // 在 D2 元件中可以顯示接收到的訊息
    return (
        <div>
            <LedControl socket={isConnected}></LedControl>
        </div>
    );
}

export function Dashboard() {
    // 使用 useState Hook 定義了一個 data 狀態變數和一個 setData 函數。
    // 當收到伺服器回應後，使用 setData 函數更新狀態，以便在元件中顯示資料。
    const [error, setError] = useState(null);
    const [cur_box, setCurBox] = useState(null);
    const [d2Message, setD2Message] = useState(""); // 新增 state 來儲存 D2 的 message

    const [message, setMessage] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connect());
    const [test, settest] = useState("");
    //socket.connected => 描述當前socket連接狀態，true：已連接；false：尚未連接

    useEffect(() => {

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
                "http://127.0.0.1:8000/boxgrowin/1/?start_date=2023-12-07"
            ).then((response) => {
                response.json().then((text) => {
                    console.log(text); // 拿到 response.body 轉成的物件
                    setMessage(text);
                    ngrowindata(text);
                });
            });
        }

        function ngrowout_update() {
            console.log("Ngrowout_update");
            fetch(
              "http://127.0.0.1:8000/boxgrowout/?box_id=1&start_date=2023-12-12")
              .then((response) => {
                response.json().then((text) => {
                  console.log(text);
              });
            });
        }

        function box_log(value) {
            console.log(value);
        }

        socket.on("getMessage", getMessage);
        // socket.on("ngrowin_update", ngrowin_update);
        socket.on("ngrowout_update", ngrowout_update);
        socket.on("box_log", box_log);
        // 在元件卸載時斷開 Socket.IO 連線
        return () => {
            // socket.disconnect()
        };
    }, []);

    const handleButtonClick = (boxId) => {
        // Call fetchData with the selected boxId
        setCurBox(boxId);
        // fetchData(boxId);
    };

    // 處理從 D2 來的 message
    const hxandleMessageFromD2 = (message) => {
      setD2Message(message);
    };

    return (
            <div className="dashboard-container">
                <h2 className="dashboard-title" style={dashboard2.theme}>
                    {dashboard2.name}
                </h2>
                <nav>
                    <ul>
                    <li>
                        <Link to="/historypic">History Pic</Link>
                    </li>
                    {/* <li>
                        <Link to="/detailinfo">Detail Info</Link>
                    </li> */}
                    <li>
                        <Link to="/ledctrl">Led Control</Link>
                    </li>
                    </ul>
                </nav>
                <div className="dashboard-content">
                    <div className="box-info">
                        {/* {boxdata && <BoxInfo data={boxdata} />} */}
                        {cur_box ? <BoxInfo socket={ isConnected } boxId={ cur_box }></BoxInfo> :
                                    <BoxInfo socket={ isConnected } boxId={ 1 } />}
                        <BoxBtnList onButtonClick={handleButtonClick} />
                        {cur_box ? <GrowInfo socket={ isConnected } boxId={ cur_box }></GrowInfo> :
                                    <GrowInfo socket={ isConnected } boxId={ 1 } />}
                        {/* {d2Message ? (
                            <div className="grow-info-container">
                                <GrowInfo data={d2Message} />
                            </div>
                        ) : growdata ? (
                        <div className="grow-info-container">
                            <GrowInfo data={growdata} />
                        </div>
                        ):null} */}
                    </div>

                    <div className="middlePic-container">
                        <div className="upper-section">
                            {/* 上半部分放置圖片 */}
                            {/* {cur_box&&<LineChartCom data={cur_box}></LineChartCom>} */}
                            {/* <img src="your-upper-image-url.jpg" alt="Upper Section" /> */}
                                {/* <D2 ngrowindata={handleMessageFromD2}></D2> */}
                            <LedControl socket={isConnected}></LedControl>
                        </div>
                        <div className="lower-section">
                            {/* 下半部分放置圖片 */}
                            <VideoStream streamUrl={"http://192.168.1.201:8080/javascript_simple.html"}></VideoStream>
                            {/* <img src="http://192.168.1.201:8080/javascript_simple.html" /> */}
                            {/* <img src="your-lower-image-url.jpg" alt="Lower Section" /> */}
                        </div>
                    </div>

                    {/* <div className="device-info">
                        <D2 ngrowindata={handleMessageFromD2}></D2>
                        <LedControl socket={isConnected}></LedControl>
                    </div> */}
                </div>
            </div>
    );
}
