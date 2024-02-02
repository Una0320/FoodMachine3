import { useState, useEffect } from 'react';
import './App.css'
import {SocketProvider} from './Component/SocketContext'
import { Dashboard } from './Component/Dashboard'
import Loginout from './Component/Loginout'
import HistoryPic from './Component/HistoryPic'
import LedCtrlPage from './Component/LedCtrlPage'
import BoxPage from './Component/BoxPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
    const [isLoggedIn, setLoginStatus] = useState(false);
    const [curUser, setCurUser] = useState({ id: null, userName: null });

    return (
        <>
            <BrowserRouter>
                <SocketProvider>
                    <Routes>
                    <Route
                        path="/"
                        element={<Loginout isLoggedIn={isLoggedIn} setLoginstatue={setLoginStatus} setCurUser={setCurUser} />}
                    />
                    <Route
                        path="/dashboard"
                        element={<Dashboard isLoggedIn={isLoggedIn} setLoginstatue={setLoginStatus} curUser={curUser} />}
                    />
                        <Route path='/' element={<Dashboard />}/>
                        <Route path='/box/:boxId' element={<BoxPage />} />
                        <Route path="historypic" element={<HistoryPic />} />
                        <Route path="ledctrl" element={<LedCtrlPage />}/>
                    </Routes>
                </SocketProvider>
            </BrowserRouter>
        </>
    )
}

export default App
