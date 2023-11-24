import React, {Component} from "react";
import { render } from "react-dom";
import { useState, useEffect } from 'react'
import BoxBtnList from "./BoxBtnList";
import { socket } from "../socket";

const dashboard2 = {
  name: 'React_Dashboard',
  theme: {
    backgroundColor: 'black',
    color: 'White'
  }
};

export function D2()
{
    // 在 D2 元件中設定 state 來管理接收到的訊息
  const [ws, setws] = useState(null);
  const [message, setMessage] = useState(' ');

    useEffect(() => {
        // 建立 Socket.IO 連線
        // ws stores socket connection status
        // When ws is empty (no connection), a connection is made.
        if (!ws){
            console.log("ws is null.");
            setws(socket.connect())
            console.log(ws);
        }
        if(ws)
        {
            // console.log(ws.id);
            ws.emit('getMessage', "ws not null");
        }

        // // 監聽來自伺服器的訊息
        // ws.on('getMessage', (data) => {
        //     console.log("getMessage:" + data);
        //     setMessage(data);
        // });

        // ws.on('updateEvent',(data) =>{
        //     console.log("updateEvent:" + data);
        //     // fetchData(cur_box);
        //     setMessage(data);
        // })

        // 在元件卸載時斷開 Socket.IO 連線
        return () => {
          socket.disconnect()
            // setws(ws.disconect());
        };
    }, [ws]); // 空的依賴陣列確保這段程式碼只執行一次

    function sendMessage()
    {
        //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
        var time = new Date();
        // ws.emit('getMessage', time);
        ws.emit('clickbtn', 'React click.');
    }

    // 在 D2 元件中可以顯示接收到的訊息
    return (
        <div>
        <h2 style={dashboard2.theme}>{dashboard2.name}</h2>
        <p>Message from server: {message}</p>
        <input type='button' value='送出訊息' onClick={sendMessage} />
        </div>
    );
}

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
        </tr>
      </thead>
      <tbody>
        {data.map((record, index) => (
          <tr key={index}>
            <td>{(record.timestamp).replace("T", " ")}</td>
            <td>{record.airtemp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 建立 D2 component
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
      const response = await fetch(`http://192.168.1.213:8000/boxinfo/${boxId}`);
      
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
      const response = await fetch(`http://192.168.1.213:8000/boxgrow/${boxId}/?start_date=2023-11-10`);
      
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
        <BoxBtnList onButtonClick={handleButtonClick} />
        {boxdata && <BoxInfo data={boxdata} />}
        {/* {boxdata && <EditBtn btnInfo={boxdata} />} */}
        {growdata ? <GrowInfo data={growdata}/> : null}
        {/* {error && <div>Error: {error}</div>} */}
        {error ? <div>Error: {error}</div> : null}
    </div>
  );
}