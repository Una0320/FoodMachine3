import React, { Component } from "react";
import { render } from "react-dom";
import { useState, useEffect } from "react";
import "../CSS/Dashboard.css";
import { Link, useNavigate } from 'react-router-dom';

import BoxBtnList from "./BoxBtnList";
import BoxInfo from "./BoxInfo";
import GrowInfo from "./GrowInfo";
// import { socket } from "../socket";
import { useSocket } from "./SocketContext";
import LedControl from "./LedControl";
import VideoStream from "./VideoStream";
import LastGrowIN from "./LastGrowIN";
import LastGrowOUT from "./LastGrowOUT";
import LastGrowAll from "./LastGrowAll";
import BoxPage from "./BoxPage";

const dashboard2 = {
    name: "FoodMachine",
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
    const [cur_box, setCurBox] = useState(1);
    const [d2Message, setD2Message] = useState(""); // 新增 state 來儲存 D2 的 message

    const [message, setMessage] = useState([]);
    // const [isConnected, setIsConnected] = useState(socket.connect());
    const socket = useSocket();

    const [test, settest] = useState("");
    //socket.connected => 描述當前socket連接狀態，true：已連接；false：尚未連接

    const [isBox3Expanded, setIsBox3Expanded] = useState(false);
    const navigate = useNavigate();

    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth() + 1;
    let year = objectDate.getFullYear();
    let fulldate = year + "-" + month + "-" + day;

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
              `http://127.0.0.1:8000/boxgrowout/?box_id=1&start_date=${fulldate}`)
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
        // socket.on("ngrowout_update", ngrowout_update);
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
        // navigate(`/box/${boxId}`);
        console.log(cur_box);
    };

    const handleBox3Click = () => {
        setIsBox3Expanded(!isBox3Expanded);
    };
    
    const handleOutsideClick = () => {
        setIsBox3Expanded(false);
    };

    const boxContent = isBox3Expanded ? (
        <div>
          {/* 新的内容 */}
          <p>This is the expanded content of Box 3.</p>
          <GrowInfo socket={socket} boxId={cur_box}></GrowInfo>
        </div>
      ) : (
        <div>
            <img src={'/sunlong.png'} alt="Sunlong"></img>
            <LastGrowIN socket={socket} boxId={cur_box}></LastGrowIN>
        </div>
    );

    const handleSettingBtnClick = () => {
        navigate('/ledctrl')
    }

    return (
            // <div className="dashboard-container">
            //     <h2 className="dashboard-title" style={dashboard2.theme}>
            //         {dashboard2.name}
            //     </h2>
            //     <nav>
            //         <ul>
            //         <li>
            //             <Link to="/historypic">History Pic</Link>
            //         </li>
            //         <li>
            //             <Link to="/ledctrl">Led Control</Link>
            //         </li>
            //         </ul>
            //     </nav>
            //     <div className="dashboard-content">
            //         <div className="box-info">
            //             {/* {boxdata && <BoxInfo data={boxdata} />} */}
            //             {/* {cur_box ? <BoxInfo socket={ socket } boxId={ cur_box }></BoxInfo> :
            //                         <BoxInfo socket={ socket } boxId={ 1 } />} */}
            //             <BoxBtnList onButtonClick={handleButtonClick} />
            //             {/* {cur_box ? <GrowInfo socket={ socket } boxId={ cur_box }></GrowInfo> :
            //                         <GrowInfo socket={ socket } boxId={ 1 } />} */}
            //             {/* {d2Message ? (
            //                 <div className="grow-info-container">
            //                     <GrowInfo data={d2Message} />
            //                 </div>
            //             ) : growdata ? (
            //             <div className="grow-info-container">
            //                 <GrowInfo data={growdata} />
            //             </div>
            //             ):null} */}
            //         </div>

            //         <div className="middlePic-container">
            //             <div className="upper-section">
            //                 {/* 上半部分放置圖片 */}
            //                 {/* {cur_box&&<LineChartCom data={cur_box}></LineChartCom>} */}
            //                 {/* <img src="your-upper-image-url.jpg" alt="Upper Section" /> */}
            //                     {/* <D2 ngrowindata={handleMessageFromD2}></D2> */}
            //                 <LedControl socket={socket}></LedControl>
            //             </div>
            //             <div className="lower-section">
            //                 {/* 下半部分放置圖片 */}
            //                 <VideoStream streamUrl={"http://192.168.1.201:8080/javascript_simple.html"}></VideoStream>
            //                 {/* <img src="http://192.168.1.201:8080/javascript_simple.html" /> */}
            //                 {/* <img src="your-lower-image-url.jpg" alt="Lower Section" /> */}
            //             </div>
            //         </div>

            //         {/* <div className="device-info">
            //             <D2 ngrowindata={handleMessageFromD2}></D2>
            //             <LedControl socket={isConnected}></LedControl>
            //         </div> */}
            //     </div>
            // </div>

            <div className="dashboard">
                <div className="sidebar">
                    {/* <div className="title">FoodMachine</div> */}
                    <img src={'/foodmachine.png'} alt="FoodMachine"></img>
                    <BoxBtnList onButtonClick={handleButtonClick}></BoxBtnList>
                    <button className="setting-button" onClick={handleSettingBtnClick}>
                        <img src={'/setting.png'} alt="Settings"></img>
                    </button>
                    {/* <button className="nav-button" data-target="addBox">ADD Box</button> */}
                </div>
                <div className="content">
                    <div className="content_up">
                        <div className="up_left" id="box1">
                            <VideoStream streamUrl={"http://192.168.1.201:8080/javascript_simple.html"}></VideoStream>
                            {/*Another camera -  http://192.168.1.187:81/stream */}
                        </div>
                        <div className="up_right" id="box2">
                            {/* <LastGrowIN socket={socket} boxId={cur_box}></LastGrowIN>
                            <LastGrowOUT socket={socket} boxId={cur_box}></LastGrowOUT> */}
                            <LastGrowAll socket={socket} boxId={cur_box}></LastGrowAll>

                        </div>
                    </div>
                    <div className="content_down">
                        <div className={`box ${isBox3Expanded ? "expanded" : ""}`} id="box3" onClick={handleBox3Click}>
                            {boxContent}
                            {/* 空白处点击时，恢复状态 */}
                            {isBox3Expanded && <div className="overlay" onClick={handleOutsideClick}></div>}
                            {/* <img src={'/sunlong.png'} alt="Sunlong"></img> */}
                            {/* <LastGrowIN socket={socket} boxId={cur_box}></LastGrowIN> */}
                        </div>
                    </div>
                </div>
            </div>        
    );
}
