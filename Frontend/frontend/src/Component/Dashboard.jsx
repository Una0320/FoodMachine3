import React, {Component} from "react";
import { render } from "react-dom";
import { useState, useEffect } from 'react'
import BoxBtnList from "./BoxBtnList";
import { socket } from "../socket";
import LedControl from "./LedControl";

const dashboard2 = {
  name: 'React_Dashboard',
  theme: {
    backgroundColor: 'black',
    color: 'White'
  }
};

// 建立 BoxInfo component
// 使用專屬的 BoxInfo component 顯示 Box 資訊。
const BoxInfo = ({ data }) => (
  <div>
    <h1>Box Info</h1>
    <p>Box id: {data.id}</p>
    <p>Box name: {data.name}</p>
    <p>Users: {data.users}</p>
    <p>Plant: {data.plant}</p>
  </div>
);

// 建立 GrowInfo component
// 使用專屬的 GrowInfo component 顯示 GrowthRecords 資訊。
const GrowInfo = ({ data }) => (
  <div>
    <h2>GrowthRecords</h2>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Airtemp</th>
          <th>Humidity</th>
          <th>Luminance</th>
        </tr>
      </thead>
      <tbody>
        {data.map((record, index) => (
          <tr key={index}>
            <td>{(record.timestamp).replace("T", " ")}</td>
            <td>{record.airtemp}</td>
            <td>{record.humidity}</td>
            <td>{record.luminance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export function D2()
{
    // 在 D2 元件中設定 state 來管理接收到的訊息
    const [message, setMessage] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connect());
    const [test, settest] = useState('');
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
        function getMessage(value){
          settest("From Socket Server: " + value);
          console.log(socket.id);
          console.log(value);
          //------------------------
          //http://127.0.0.1:8000/boxinfo/1
          fetch('http://127.0.0.1:8000/boxgrowin/1/')
            .then(response => {
              response.json().then(text => {
                console.log(test + ": " + text.users);  // 拿到 response.body 轉成的物件
                setMessage(text);
              })
            })
        }

        function ngrowin_update(){
          console.log('N-growin update');
          fetch('http://127.0.0.1:8000/boxgrowin/1/?start_date=2023-12-04')
            .then(response => {
                response.json().then(text => {
                console.log(text);  // 拿到 response.body 轉成的物件
                setMessage(text);
              })
            })
        }
        
        function ngrowout_update(){
          console.log('Ngrowout_update')
        }
        function data_change(){
          console.log('Empty Event');
        }

        socket.on('getMessage', getMessage);
        socket.on('ngrowin_update', ngrowin_update)
        socket.on('ngrowout_update', ngrowout_update)
        socket.on('data_change', data_change);
        // 在元件卸載時斷開 Socket.IO 連線
        return () => {
          // socket.disconnect()
        };
    }, []);


    // 在 D2 元件中可以顯示接收到的訊息
    return (
        <div>
        <h2 style={dashboard2.theme}>{dashboard2.name}</h2>
        <p>{test}</p>
        {/* {message && <BoxInfo data={message} />} */}
        {/* {message ? <GrowInfo data={message}/> : null} */}
        <LedControl socket={isConnected}></LedControl>
        </div>
    );
}


export function Dashboard()
{
    // 使用 useState Hook 定義了一個 data 狀態變數和一個 setData 函數。
    // 當收到伺服器回應後，使用 setData 函數更新狀態，以便在元件中顯示資料。
    const [boxdata, setData] = useState(null);
    const [growdata, setGData] = useState(null);
    const [error, setError] = useState(null);
    const [cur_box, setCurBox] = useState(null);

    const fetchData = async (boxId) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/boxinfo/${boxId}`);
          
          if (response.ok) {
            const jsonData = await response.json();
            console.log(jsonData.users);
            setData(jsonData);
          } else {
            const errorData = await response.json();
            setError(errorData.message);
          }
        } 
        catch (error) {
          console.error('An error occurred:', error);
        }
        // -----------------growth info-------------------
        try {
          const response = await fetch(`http://127.0.0.1:8000/boxgrowin/${boxId}/?start_date=2023-11-10 14:40:00`);
          
          if (response.ok) {
            const jsonData = await response.json();
            setGData(jsonData);
            console.log(jsonData);
          } else {
            const errorData = await response.json();
            setError(errorData.message);
          }
        } 
        catch (error) {
          console.error('An error occurred:', error);
        }
    };

    const handleButtonClick = (boxId) => {
      // Call fetchData with the selected boxId
      setCurBox(boxId);
      fetchData(boxId);
    };

    return (
      <div>
          <D2></D2>
          {/* <LedControl></LedControl> */}
          <BoxBtnList onButtonClick={handleButtonClick} />
          {boxdata && <BoxInfo data={boxdata} />}
          {/* {boxdata && <EditBtn btnInfo={boxdata} />} */}
          {growdata ? <GrowInfo data={growdata}/> : null}
          {/* {error && <div>Error: {error}</div>} */}
          {error ? <div>Error: {error}</div> : null}
      </div>
    );
}