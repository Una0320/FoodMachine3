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
const { createServer } = require("http");
// const { Server } = require("socket.io");

const app = express();

app.use(cors())

const httpServer = createServer(app);
// const io = new Server(httpServer, { /* options */ });

const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://127.0.0.1:3000",
      methods: ["GET", "POST"]
    }
  });

// server-side
io.on("connection", (socket) => {
    console.log(socket.id); // ojIckSD2jqNzOqIrAGzL

    
  });
  
httpServer.listen(3001);