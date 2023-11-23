// socketio/server.js

// const io = require('socket.io')(3001);  // 使用 3001 port，你可以根據需要修改
const cors = require('cors');

// io.use(cors());

// io.on('connection', (socket) => {
//     console.log('A user connected');

//     // 接收來自前端的訊息
//     socket.on('message', (data) => {
//     console.log('Message from client:', data);

//     // 在這裡處理訊息，例如將訊息轉發給樹莓派硬體
//     // ...

//     // 發送回應給前端
//     socket.emit('message', 'Server received your message');
//     });

//     // 斷線處理
//     socket.on('disconnect', () => {
//     console.log('User disconnected');
//     });
// });

// // io.listen(3001);
// console.log('SocketIO listening port');

const express = require("express");
const app = express();
app.use(cors());
//將 express 放進 http 中開啟 Server 的 3000 port ，正確開啟後會在 console 中印出訊息
const server = require('http').Server(app)
    .listen(3001,()=>{console.log('open server!')})



const io = require("socket.io")(server, {
    cors: {
      origin: "http://127.0.0.1:3000",
      methods: ["GET", "POST"]
    }
  });

// server-side
io.on("connection", (socket) => {
    //經過連線後在 console 中印出訊息
    console.log('success connect!')
    // console.log('Client:${socket.id}'); // ojIckSD2jqNzOqIrAGzL
    socket.on("connect", () => {
        console.log('success connect!')
        console.log("Server-side "+socket.id); // ojIckSD2jqNzOqIrAGzL
    });

    //監聽透過 connection 傳進來的事件
    socket.on('getMessage', message => {
        //回傳 message 給發送訊息的 Client
        var time = new Date();
        console.log("From Client:"+ message)
        socket.emit('getMessage', time)
    })
    
  });