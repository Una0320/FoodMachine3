// SocketContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from "../socket";

// 創建一個上下文
const SocketContext = createContext();

// 定義一個自定義 hook 來簡化使用上下文的代碼
export function useSocket() {
    return useContext(SocketContext);
}

// 提供 SocketContext.Provider 的包裹組件，這樣子組件樹中的所有子組件都可以訪問 socket
export function SocketProvider({ children }) {
    const [isConnected, setSocket] = useState(socket.connect());

    // 在組件創建時初始化 socket 並在組件卸載時斷開連接
    useEffect(() => {
        // const newSocket = io('YOUR_SOCKET_SERVER_URL');
        // setSocket(newSocket);

        // 在組件卸載時斷開連接
        // return () => isConnected.disconnect();
    }, []);

    return (
        <SocketContext.Provider value={isConnected}>
            {children}
        </SocketContext.Provider>
    );
}
