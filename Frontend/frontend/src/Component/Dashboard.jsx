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
import UserList from "./UserList";
import GrowInfo from "./GrowInfo";
import LedControl from "./LedControl";
import VideoStream from "./VideoStream";
import LastGrowIN from "./LastGrowIN";
import LastGrowOUT from "./LastGrowOUT";
import LastGrowAll from "./LastGrowAll";
import VideoandPic from "./VideoandPic";
import LineChartCom from "./LineChartCom";
import BoxPage from "./BoxPage";


export function Dashboard() {
    const [cur_box, setCurBox] = useState(1);
    const [cur_user, setCurUser] = useState(1);

    const [message, setMessage] = useState([]);

    // const [isConnected, setIsConnected] = useState(socket.connect());
    const socket = useSocket();

    const [test, settest] = useState("");
    //socket.connected => 描述當前socket連接狀態，true：已連接；false：尚未連接
    // 初始顯示 Dashboard 頁面
    const [currentPage, setCurrentPage] = useState("dashboard");
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

    const handleUserSelect = (user) => {
        // 選擇使用者後的處理邏輯，例如更新狀態或執行其他操作
        setCurUser(user);
        console.log(cur_user);
        // 這裡可以加入更新 sidebar 的邏輯，根據所選的使用者
        // updateSidebar(user);
    };

    const handleButtonClick = (boxId) => {
        // Call fetchData with the selected boxId
        setCurBox(boxId);
        console.log(cur_box);
    };

    const handlePageBtnClick = (pagename) => {
        setCurrentPage(pagename);
        // navigate('/ledctrl')
    }

    return (
        <div className="dashboard">
            <ChartCtrlProvider>
            <div id="Banner" className="Banner">
                <img className="BannerLogo" src="/logo.png"></img>
                <img className="BannerBell" src="/bell.png"></img>
                {/* <span className="BannerUsername">root1</span> */}
                <UserList onSelectClick={handleUserSelect}></UserList>
                <img src="user.png" alt="" className="profile-image" />
            </div>
            <div id="Panel" className="Panel">
                <div className="sidebar">
                    <div id="Menu" style={{paddingBottom: 40 + 'px'}}>
                        <h3>MENU</h3>
                        <button className={`image-button ${currentPage === 'dashboard' ? 'active' : ''}`}
                                onClick={() => handlePageBtnClick('dashboard')}>
                            <img src="/dashboard.svg" alt="Dashboard"/>
                            <span className="button-text">Dashboard</span>
                        </button>
                        <button  className={`image-button ${currentPage === 'ledctrl' ? 'active' : ''}`}
                                 onClick={() => handlePageBtnClick('ledctrl')}>
                            <img src={'/unlightctrl.png'} alt="LightCtrl"></img>
                            <span className="button-text">Light Control</span>
                        </button>
                        <button className={`image-button ${currentPage === 'setting' ? 'active' : ''}`}
                                onClick={() => handlePageBtnClick('setting')}>
                            <img src={'/un_setting.png'} alt="Settings"></img>
                            <span className="button-text">Setting</span>
                        </button>
                    </div>
                    <div id="Userboxes">
                        <h3>BOXES</h3>
                        <BoxBtnList userId={cur_user} onButtonClick={handleButtonClick}></BoxBtnList>
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
                    )}
                    {currentPage == "setting" && (
                        <>
                        <BoxPage socket={socket} boxId={cur_box}></BoxPage>
                        </>
                    )}
                </div>
            </div>
            <div className="foot">  </div>
            </ChartCtrlProvider>
        </div>        
    );
}
