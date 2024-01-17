import React, { Component } from "react";
import { render } from "react-dom";
import { useState, useEffect } from "react";
import "../CSS/Dashboard.css";
import { Link, useNavigate } from 'react-router-dom';

// import { socket } from "../socket";
import { useSocket } from "./SocketContext";
import { ChartCtrlProvider } from "./ChartCtlContext";
import { ContentProvider } from "./ContentContext";

import BoxBtnList from "./BoxBtnList";
import BoxInfo from "./BoxInfo";
import GrowInfo from "./GrowInfo";
import LedControl from "./LedControl";
import VideoStream from "./VideoStream";
import LastGrowIN from "./LastGrowIN";
import LastGrowOUT from "./LastGrowOUT";
import LastGrowAll from "./LastGrowAll";
import VideoandPic from "./VideoandPic";
import LineChartCom from "./LineChartCom";


export function Dashboard() {
    // 使用 useState Hook 定義了一個 data 狀態變數和一個 setData 函數。
    // 當收到伺服器回應後，使用 setData 函數更新狀態，以便在元件中顯示資料。
    const [error, setError] = useState(null);
    const [cur_box, setCurBox] = useState(1);

    const [message, setMessage] = useState([]);

    // const [isConnected, setIsConnected] = useState(socket.connect());
    const socket = useSocket();

    const [test, settest] = useState("");
    //socket.connected => 描述當前socket連接狀態，true：已連接；false：尚未連接
    // 初始顯示 Dashboard 頁面
    const [currentPage, setCurrentPage] = useState("dashboard");
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
            console.log(new Date() + ":" + value);
        }

        socket.on("getMessage", getMessage);
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
        setCurrentPage("ledctrl");
        // navigate('/ledctrl')
    }

    return (
        <div className="dashboard">
            <ChartCtrlProvider>
            <div id="Banner" className="Banner">
                <img className="BannerLogo" src="/logo.png"></img>
            </div>
            <div id="Panel" className="Panel">
                <div className="sidebar">
                    <div id="Menu" style={{paddingBottom: 40 + 'px'}}>
                        <h3>MENU</h3>
                        <button className="image-button active">
                            <img src="/dashboard.svg" alt="Dashboard"/>
                            <span className="button-text">Dashboard</span>
                        </button>
                        <button className="image-button" onClick={handleSettingBtnClick}>
                            <img src={'/un_setting.png'} alt="LightCtrl"></img>
                            <span className="button-text">Light Control</span>
                        </button>
                        <button className="image-button">
                            <img src={'/un_setting.png'} alt="Settings"></img>
                            <span className="button-text">Setting</span>
                        </button>
                    </div>
                    <div id="Userboxes">
                        <h3>USER</h3>
                        <BoxBtnList onButtonClick={handleButtonClick}></BoxBtnList>
                    </div>
                </div>
                <div className="content">
                    {currentPage === "dashboard" && (
                        <>
                        <div className="content_up">
                            <div className="up_right" id="box2">
                                <LastGrowAll socket={socket} boxId={cur_box}></LastGrowAll>
                            </div>
                            <VideoandPic socket={socket} boxId={cur_box}></VideoandPic>
                        </div>
                        <div className="content_down">
                            <LineChartCom socket={socket} boxId={cur_box}></LineChartCom>
                        </div>
                        </>
                    )}
                    {currentPage == "ledctrl" && (
                        <>
                        <LedControl socket={socket} onBack={() => setCurrentPage("dashboard")}></LedControl>
                        </>
                    )

                    }
                </div>
            </div>
            <div>foot</div>
            </ChartCtrlProvider>
        </div>        
    );
}
