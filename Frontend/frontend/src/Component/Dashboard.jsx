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
import LedControl from "./LedControl";
import LastGrowAll from "./LastGrowAll";
import VideoandPic from "./VideoandPic";
import LineChartCom from "./LineChartCom";
import BoxPage from "./BoxPage";


export function Dashboard({isLoggedIn, setLoginstatue, curUser}) {
    // const [isLogin, setisLogin] = useState(false);
    const [cur_box, setCurBox] = useState(1);
    const [cur_user, setCurUser] = useState(curUser.id);
    const api_url = "http://10.100.2.109:8000"

    const [message, setMessage] = useState([]);

    // const [isConnected, setIsConnected] = useState(socket.connect());
    const socket = useSocket();

    //socket.connected => 描述當前socket連接狀態，true：已連接；false：尚未連接
    const [test, settest] = useState("");
    
    // 初始顯示 Dashboard 頁面
    const [currentPage, setCurrentPage] = useState("dashboard");
    const navigate = useNavigate();

    // let objectDate = new Date();
    // let day = objectDate.getDate();
    // let month = objectDate.getMonth() + 1;
    // let year = objectDate.getFullYear();
    // let fulldate = year + "-" + month + "-" + day;

    useEffect(() => {
        function box_log(value) {
            console.log(new Date() + ":" + value);
        }
        console.log("D-socket", socket.connected);
        console.log("D-socket:", socket.id);
        socket.on("box_log", box_log);
        // 在元件卸載時斷開 Socket.IO 連線
        return () => {
            // socket.disconnect()
        };
    }, []);

    const handleUserSelect = (user) => {
        setCurUser(user);
        console.log("D-socket", socket.connected);
        console.log(cur_user);
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
    // 如果用户未登录，则重定向到登录页面
    if (!isLoggedIn) {
        return navigate('/')
    }
    return (
        <div className="dashboard">
            <ChartCtrlProvider>
            <div id="Banner" className="Banner">
                <img className="BannerLogo" src="/logo.png"></img>
                <img className="BannerBell" src="/bell.png"></img>
                {/* <Loginout isLoggedIn={isLogin} setLoginstatue={setisLogin} setCurUser={handleUserSelect}></Loginout>) */}
                <UserList isLoggedIn={isLoggedIn} setLoginstatue={setLoginstatue}
                            CurUser={curUser} onSelectClick={handleUserSelect}
                            url={api_url}></UserList>
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
                        <BoxBtnList userId={curUser.id} onButtonClick={handleButtonClick} url={api_url}></BoxBtnList>
                    </div>
                </div>
                <div className="content">
                    {/* <ContentProvider socket={socket} boxId={cur_box}> */}
                    {currentPage === "dashboard" && (
                        <>
                        <div className="content_up">
                            <div className="up_right" id="box2">
                                <LastGrowAll socket={socket} boxId={cur_box} url={api_url}></LastGrowAll>
                            </div>
                            <VideoandPic socket={socket} boxId={cur_box} url={api_url}></VideoandPic>
                        </div>
                        <div className="content_down">  
                            <LineChartCom socket={socket} boxId={cur_box} url={api_url}></LineChartCom>
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
                    {/* </ContentProvider> */}
                </div>                
            </div>
            <div className="foot">  </div>
            </ChartCtrlProvider>
        </div>        
    );
}
